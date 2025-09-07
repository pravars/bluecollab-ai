import { Request, Response } from 'express';
export declare class UserController {
    createUser(req: Request, res: Response): Promise<void>;
    loginUser(req: Request, res: Response): Promise<void>;
    getUserProfile(req: Request, res: Response): Promise<void>;
    updateUserProfile(req: Request, res: Response): Promise<void>;
    getUserById(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<void>;
    deleteUser(req: Request, res: Response): Promise<void>;
    getUsers(req: Request, res: Response): Promise<void>;
    verifyEmail(req: Request, res: Response): Promise<void>;
    verifyPhone(req: Request, res: Response): Promise<void>;
    changePassword(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=UserController.d.ts.map