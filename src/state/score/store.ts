import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Event } from '../events/types';

export interface ScoreState {
    points: Event[];
    score: number;
}

const initialState: ScoreState = {
    points: [],
    score: 0,
};

export const slice = createSlice({
    name: 'score',
    initialState,
    reducers: {
        reset: (state) => {
            state.points = [];
            state.score = 0;
        },
        setPoints: (state, action: PayloadAction<Event[]>) => {
            state.points = action.payload;
            state.score = action.payload.reduce((acc, p) => acc + p.points, 0);
        },
    },
});

export const { actions } = slice;
export default slice.reducer;
