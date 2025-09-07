import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        userType: string;
    };
}
export declare function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=authMiddleware.d.ts.map