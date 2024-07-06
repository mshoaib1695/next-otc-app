export type Code = {
    value: string;
    isValid: boolean;
    isChecked: boolean;
    when: string;
};

export type Profile = {
    social: {
        twitter: {
            userId?: string;
            screenName?: string;
            avatar?: string;
            writedPostAt?: string;
        };
        discord: {
            code?: string;
            activatedAt?: string;
        };
    };
    wallet: string;
    points: {
        transaction: string;
        eventType:
            | 'referralAccepted'
            | 'referralGenerated'
            | 'referralInviteAccepted'
            | 'externalInviteAccepted'
            | 'otcSwapped'
            | 'stakeOvernightUpdate'
            | 'socialXFollowed'
            | 'socialXFinalPost'
            | 'socialXInitialPost'
            | 'socialDiscordServerJoin';
        when: string;
        grossValue: number;
        points: number;
        wallet: string;
        updatedAt: string;
        extras: Record<string, unknown>;
    }[];
    invitedBy: {
        type: 'wallet' | 'thirdParty';
        from?: string;
    };
    vam: {
        value: number;
        calculatedAt: string;
    };
    history: {
        ip?: string;
        when: string;
    }[];
    referralGeneratedAt?: string;
    calculatedVamAt?: string;
    updatedAt: string;
};
