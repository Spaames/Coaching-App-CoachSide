import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BlockState {
    tableHeadOrder : string[];
}

const initialState: BlockState = {
    tableHeadOrder: ["None", "None", "None", "None", "None", "None", "None", "None", "None", "None", "None", "None", "None"],
}

const blockSlice = createSlice({
    name: 'block',
    initialState,
    reducers: {

    },
});



