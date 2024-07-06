import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Rank } from './types';

interface State {
    isRunning: boolean;
    leaderboard: Rank[];
}

const initialState: State = {
    isRunning: false,
    leaderboard: [
        {
            key: 0,
            rank: 0,
            associatedWallets: [],
            invitedBy: {
                thirdParty: '',
                wallet: '',
            },
            points: 0,
            self: false,
            updatedAt: '',
            wallet: '',
        },
    ],
};

export const slice = createSlice({
    name: 'leaderboard',
    initialState,
    reducers: {
        start: (state) => {
            state.isRunning = true;
        },
        stop: (state) => {
            state.isRunning = false;
        },
        updateLeaderboard: (state, action: PayloadAction<Rank>) => {
            // TODO: alterar na api de key para self (boolean) assim simplifica aqui tambem
            if (action.payload?.key === 0) {
                state.leaderboard[action.payload.key] = {
                    ...action.payload,
                    self: true,
                };
            } else {
                state.leaderboard[action.payload.rank] = action.payload;
            }
        },
        reset: (state) => {
            state.leaderboard = state.leaderboard.filter((item) => !item.self);
        },
    },
});

export const { actions } = slice;
export default slice.reducer;
