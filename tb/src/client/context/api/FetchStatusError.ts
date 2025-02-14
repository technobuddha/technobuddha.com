export class FetchStatusError extends Error {
    constructor(message?: string, public status?: number, public statusText?: string) {
        super(message);
        this.name = 'FetchStatusError';
    }
}

export default FetchStatusError;
