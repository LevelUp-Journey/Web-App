// This is a learning response interface to better handle errors and success status
// In fact, this is what backend returns
export interface LearningResponse<T> {
    data: T;
    statusCode: number;
    success: boolean;
}
