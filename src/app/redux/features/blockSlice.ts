import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from "@/app/redux/store";

interface Exercise {
    type?: string;
    name?: string;
    sets?: number;
    reps?: number;
    rpe?: string;
    percentage?: number;
    rir?: number;
    tst?: string;
    load?: number;
    rest?: string;
    instructions?: string;
    day: number;
    week: number;
    order: number;
}

interface BlockState {
    name: string;
    start: string;
    end: string;
    athlete: string;
    exercises: Exercise[];
    loading: boolean;
    error: string | null;
}

const initialState: BlockState = {
    name: "",
    start: "",
    end: "",
    athlete: "",
    exercises: [],
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
        createBlockSuccess(state, action: PayloadAction<{
            name: string; start: string; end: string; athlete: string; exercises: Exercise[];
        }>) {
            state.name = action.payload.name;
            state.start = action.payload.start;
            state.end = action.payload.end;
            state.athlete = action.payload.athlete;
            state.exercises = action.payload.exercises;
            state.loading = true;
            state.error = null;
        },
        createBlockFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { createBlockStart, createBlockSuccess, createBlockFailure } = blockSlice.actions;

export const createBlockThunk = ({ name, athlete, exercises }: { name: string; athlete: string; exercises: Exercise[] }): AppThunk => async (dispatch) => {
    dispatch(createBlockStart());

    const weeks = exercises.map(exercise => exercise.week);
    const currentYear = new Date().getFullYear();
    const start = `${Math.min(...weeks)}-${currentYear}`;
    const end = `${Math.max(...weeks)}-${currentYear}`;

    try {
        const response = await fetch("/api/saveBlock", {
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

export default blockSlice.reducer;