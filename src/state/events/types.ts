export interface Event {
    wallet: string;
    updatedAt: string;
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
        | 'socialDiscordServerJoin'
        | 'calculatedVAM'
        | 'joinedToAirdrop';
    when: string;
    grossValue: number;
    points: number;
    extras: Record<string, unknown>;
}
