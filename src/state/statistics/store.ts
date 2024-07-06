import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Statistics } from './types';

interface State {
    isRunning: boolean;
    statistics: Statistics;
}

const initialState: State = {
    isRunning: false,
    statistics: {
        tvl: null,
        users: null,
        wallets: null,
        otc: null,
        updatedAt: null,
    },
};

export const slice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        start: (state) => {
            state.isRunning = true;
        },
        stop: (state) => {
            state.isRunning = false;
        },
        updateStatistics: (state, action: PayloadAction<Statistics>) => {
            state.statistics.updatedAt = action.payload.updatedAt;
            state.statistics.tvl = action.payload.tvl;
            state.statistics.users = action.payload.users;
            state.statistics.wallets = action.payload.wallets;
            state.statistics.otc = action.payload.otc;
        },
    },
});

export const { actions } = slice;
export default slice.reducer;
