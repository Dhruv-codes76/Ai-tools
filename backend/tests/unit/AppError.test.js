const AppError = require('../../src/utils/AppError');

describe('AppError', () => {
    test('should set the message and statusCode correctly', () => {
        const message = 'Test error message';
        const statusCode = 400;
        const error = new AppError(message, statusCode);

        expect(error.message).toBe(message);
        expect(error.statusCode).toBe(statusCode);
    });

    test('should set status to "fail" for 4xx status codes', () => {
        const error = new AppError('Bad Request', 400);
        expect(error.status).toBe('fail');

        const errorNotFound = new AppError('Not Found', 404);
        expect(errorNotFound.status).toBe('fail');
    });

    test('should set status to "error" for non-4xx status codes', () => {
        const error = new AppError('Internal Server Error', 500);
        expect(error.status).toBe('error');

        const errorBadGateway = new AppError('Bad Gateway', 502);
        expect(errorBadGateway.status).toBe('error');
    });

    test('should set isOperational to true', () => {
        const error = new AppError('Operational error', 400);
        expect(error.isOperational).toBe(true);
    });

    test('should capture the stack trace', () => {
        const error = new AppError('Test error', 500);
        expect(error.stack).toBeDefined();
    });

    test('should be an instance of Error', () => {
        const error = new AppError('Test error', 500);
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(AppError);
    });
});
