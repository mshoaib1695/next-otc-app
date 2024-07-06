import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
    isRunning: boolean;
    vamMultiplier: number;
    price: number;
}

const initialState: State = {
    isRunning: false,
    vamMultiplier: 1.0,
    price: import.meta.env.VITE_OTC_PRICE ? parseFloat(import.meta.env.VITE_OTC_PRICE) : 2.5,
};

export const slice = createSlice({
    name: 'otcInfo',
    initialState,
    reducers: {
        setVAMMultiplier: (state, action: PayloadAction<number>) => {
            state.vamMultiplier = action.payload;
        },
        isRunning: (state, action: PayloadAction<boolean>) => {
            state.isRunning = action.payload;
        },
        startRegisterVAM: () => {},
        setPrice: (state, action: PayloadAction<number>) => {
            state.price = action.payload;
        },
    },
});

export const { actions } = slice;
export default slice.reducer;
