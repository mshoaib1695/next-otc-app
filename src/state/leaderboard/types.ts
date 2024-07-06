export interface Rank {
    key?: number;
    rank: number;
    points: number;
    wallet: string;
    updatedAt: string;
    invitedBy: {
        wallet: string;
        thirdParty: string;
    } | null;
    // invitedBy: string;
    self: boolean;
    associatedWallets: string[];
}
