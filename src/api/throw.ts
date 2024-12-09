export const generateThrow = (message: string) => {
    return Object.assign(
        new Error(message),
        { code: 402 }
    );
}