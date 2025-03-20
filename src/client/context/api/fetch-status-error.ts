export class FetchStatusError extends Error {
  public constructor(
    message?: string,
    public status?: number,
    public statusText?: string,
  ) {
    super(message);
    this.name = 'FetchStatusError';
  }
}
