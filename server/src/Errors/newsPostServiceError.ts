export class NewsPostServiceError extends Error {
    constructor (message: string) {
        super(message);
        this.name = 'NewsPostServiceError';
    }
}