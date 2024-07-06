export interface Avatar {
    screenName: string;
    url: string;
    fullFilled?: boolean;
}

export type AvatarResponse = Avatar & { wallet: string };
