export default class ApiErrorResponse extends Error {
    statusCode: any;
    constructor(message: any, statusCode?: any) {
        super(message);
        this.statusCode = statusCode || null;
    }
}