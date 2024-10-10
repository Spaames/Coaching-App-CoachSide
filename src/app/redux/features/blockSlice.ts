import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from "@/app/redux/store";

interface Intensity {
    type?: string | null;
    value?: number | null;
}

interface Exercise {
    type?: string;
    name?: string;
    sets?: number;
    reps?: number;
    intensity?: Intensity | null;
    load?: number;
    rest?: string;
    instructions?: string;
    day: number;
    week: number;
    order: number;
}

interface Block {
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
        createBlockFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        getBlocksFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    createBlockStart,
    createBlockSuccess,
    createBlockFailure,
    getBlocksStart,
    getBlocksSuccess,
    getBlocksFailure,
} = blockSlice.actions;

export const createBlockThunk = ({ name, athlete, exercises }: { name: string; athlete: string; exercises: Exercise[] }): AppThunk => async (dispatch) => {
    dispatch(createBlockStart());

    const weeks = exercises.map(exercise => exercise.week);
    const currentYear = new Date().getFullYear();
    const start = `${Math.min(...weeks)}-${currentYear}`;
    const end = `${Math.max(...weeks)}-${currentYear}`;

    try {
        const response = await fetch("/api/createBlock", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, start, end, athlete, exercises }),
        });

        const data = await response.json();
        if (response.ok) {
            dispatch(createBlockSuccess({ name: name, start, end, athlete, exercises }));
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
}

export default blockSlice.reducer;