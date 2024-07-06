export interface APIResponse<T = undefined> {
    code: string;
    transaction: string;
    message: string;
    args: string[];
    data: T;
}
