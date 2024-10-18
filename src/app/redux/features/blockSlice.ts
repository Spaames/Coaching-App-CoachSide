import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from "@/app/redux/store";
import { v4 as uuidv4 } from 'uuid';

export interface Intensity {
    type?: string | null;
    value?: number | null;
}

export interface Perf {
    set: number;
    reps: number;
    load: number;
    notes: string;
}

export interface Exercise {
    type?: string;
    name?: string;
    primaryMuscle?: string;
    secondaryMuscle?: string;
    sets?: number;
    indicatedReps?: string;
    intensity?: Intensity | null;
    indicatedLoad?: string;
    realPerf: Perf | null;
    rest?: string;
    instructions?: string;
    day: number;
    week: number;
    order: number;
}

export interface Block {
    id?: string;
    name: string;
    start?: string;
    end?: string;
    athlete: string;
    exercises: Exercise[];
}

interface BlockState {
    blocks: Block[];
    loading: boolean;
    error: string | null;
}

const initialState: BlockState = {
    blocks: [],
    loading: false,
    error: null,
}

const blockSlice = createSlice({
    name: 'block',
    initialState,
    reducers: {
        createBlockStart(state) {
            state.loading = true;
        },
        getBlocksStart(state) {
            state.loading = true;
        },
        updateBlockStart(state) {
            state.loading = true;
        },
        createBlockSuccess(state, action: PayloadAction<Block>) {
            state.blocks.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        getBlocksSuccess(state, action: PayloadAction<Block[]>) {
            state.error = null;
            state.loading = false;
            state.blocks = action.payload;

        },
        updateBlockSuccess(state, action: PayloadAction<Block>) {
            const index = state.blocks.findIndex(block => block.id === action.payload.id);
            if (index != -1) {
                state.blocks[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        createBlockFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        getBlocksFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        updateBlockFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    createBlockStart,
    createBlockSuccess,
    createBlockFailure,
    getBlocksStart,
    getBlocksSuccess,
    getBlocksFailure,
    updateBlockStart,
    updateBlockSuccess,
    updateBlockFailure,
} = blockSlice.actions;

export const createBlockThunk = ({ name, athlete, exercises }: { name: string; athlete: string; exercises: Exercise[] }): AppThunk => async (dispatch) => {
    dispatch(createBlockStart());

    const weeks = exercises.map(exercise => exercise.week);
    const currentYear = new Date().getFullYear();
    const start = `${Math.min(...weeks)}-${currentYear}`;
    const end = `${Math.max(...weeks)}-${currentYear}`;
    const id = uuidv4();

    try {
        const response = await fetch("/api/createBlock", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name: name, start, end, athlete, exercises }),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(createBlockSuccess({ id, name: name, start, end, athlete, exercises }));
        } else {
            dispatch(createBlockFailure(data.message));
        }
    } catch (error) {
        dispatch(createBlockFailure("Error while saving block"));
    }
};

export const getBlocksThunk = (athlete: string): AppThunk => async (dispatch) => {
    dispatch(getBlocksStart());

    try {
        const response = await fetch("/api/getBlocks", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ athlete }),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(getBlocksSuccess(data.blockList));
        } else {
            dispatch(createBlockFailure(data.message));
        }
    } catch (error) {
        dispatch(getBlocksFailure("Error while fetching Blocks"));
    }
};

export const updateBlockThunk = (updatedBlock: Block): AppThunk => async (dispatch) => {
    dispatch(updateBlockStart());

    try {
        const response = await fetch("/api/updateBlock", {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBlock),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(updateBlockSuccess(updatedBlock));
            console.log(data.message);
        } else {
            dispatch(createBlockFailure(data.message));
        }
    } catch (error) {
        dispatch(updateBlockFailure("Error while updating block"));
    }
};

export default blockSlice.reducer;