import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Code, Profile } from './types';

interface State {
    isRunning: boolean;
    inviteCode: Code;
    discordCode: Code;
    referral: Code;
    shortlink: {
        value: null | string;
        generated: boolean;
    };
    wallet: null | string;
    token: null | string;
    urlPostX: null | string;
    balance: number;
    vam: {
        value: number;
        calculatedAt: null | string;
    };
    profile: Profile | null;
}

const initialState: State = {
    isRunning: false,
    inviteCode: {
        value: '',
        isValid: false,
        isChecked: false,
        when: '',
    },
    discordCode: {
        value: '',
        isValid: false,
        isChecked: false,
        when: '',
    },
    referral: {
        value: '',
        isValid: false,
        isChecked: false,
        when: '',
    },
    shortlink: {
        value: null,
        generated: false,
    },
    urlPostX: null,
    wallet: null,
    token: null,
    balance: 0,
    vam: {
        value: 1,
        calculatedAt: null,
    },
    profile: null,
};

export const slice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        start: (state) => {
            state.isRunning = true;
        },
        stop: (state) => {
            state.isRunning = false;
        },
        setInviteCode: (state, action: PayloadAction<string>) => {
            state.inviteCode.value = action.payload;
            state.inviteCode.isChecked = false;
            state.inviteCode.when = new Date().toISOString();
            state.inviteCode.isValid = false;

            // clear referral code
            state.referral.value = '';
            state.referral.isChecked = false;
            state.referral.isValid = false;
            state.referral.when = '';
        },
        checkedInviteCode: (state, action: PayloadAction<boolean>) => {
            state.inviteCode.isChecked = true;
            state.inviteCode.isValid = action.payload;
            state.inviteCode.when = new Date().toISOString();
        },
        checkedReferralCode: (state, action: PayloadAction<boolean>) => {
            state.referral.isChecked = true;
            state.referral.isValid = action.payload;
            state.referral.when = new Date().toISOString();
        },
        setReferral: (state, action: PayloadAction<string | null>) => {
            state.referral.value = action.payload || '';

            // clear invite code
            state.inviteCode.value = '';
            state.inviteCode.isChecked = false;
            state.inviteCode.isValid = false;
            state.inviteCode.when = '';
        },
        setWallet: (state, action: PayloadAction<string>) => {
            state.wallet = action.payload;
            if (action.payload.trim().length === 0) {
                state.token = null;
            }
        },
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },
        setShortlink: (state, action: PayloadAction<string | null>) => {
            if (state.shortlink.generated) return;
            state.shortlink = {
                value: action.payload,
                generated: false,
            };
        },
        askGenerateShortlink: () => {},
        askFollowTwitter: () => {},
        requestLogin: (_state, _action: PayloadAction<string>) => {},
        postToX: (_state, _action: PayloadAction<string>) => {},
        generateShortlink: (state) => {
            state.shortlink.generated = true;
        },
        setDiscordCode: (state, action: PayloadAction<string>) => {
            state.discordCode.value = action.payload;
            state.discordCode.isChecked = true;
            state.discordCode.when = new Date().toISOString();
            state.discordCode.isValid = true;
        },
        clearInviteCode: (state) => {
            state.inviteCode.value = '';
            state.inviteCode.isChecked = false;
            state.inviteCode.isValid = false;
            state.inviteCode.when = '';

            state.referral.value = '';
            state.referral.isChecked = false;
            state.referral.isValid = false;
            state.referral.when = '';
        },
        setDisconnect: (state) => {
            if (state.token === '' || state.token === null) {
                state.wallet = '';
                return;
            }
            state.inviteCode = {
                value: '',
                isValid: false,
                isChecked: false,
                when: '',
            };
            state.discordCode = {
                value: '',
                isValid: false,
                isChecked: false,
                when: '',
            };
            state.referral = {
                value: '',
                isValid: false,
                isChecked: false,
                when: '',
            };
            state.shortlink = {
                value: null,
                generated: false,
            };
            state.wallet = '';
            state.token = '';
            state.urlPostX = null;
            state.vam = {
                value: 1,
                calculatedAt: null,
            };
        },
        setPost: (state, action: PayloadAction<string>) => {
            state.urlPostX = action.payload;
            const intent = new URL('https://twitter.com/intent/tweet');
            intent.searchParams.set('url', `${action.payload}?${Date.now()}`);
            window.open(intent.toString(), '_blank');
        },
        setProfile: (state, action: PayloadAction<Profile>) => {
            state.profile = action.payload;
            state.vam.value = action.payload.vam.value;
            state.vam.calculatedAt = action.payload.vam.calculatedAt;
        },
        setVam: (state, action: PayloadAction<{ value: number; calculatedAt: string | null }>) => {
            state.vam = action.payload;
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        changedWalet: (state, action: PayloadAction<string>) => {},
    },
});

export const { actions } = slice;
export default slice.reducer;
