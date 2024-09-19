import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface User {
    username: string;
    firstName: string;
    lastName: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: {
        username: 'N/A',
        firstName: 'N/A',
        lastName: 'N/A',
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = {
                username: 'N/A',
                firstName: 'N/A',
                lastName: 'N/A',
            };
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
