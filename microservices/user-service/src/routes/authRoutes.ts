import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema } from '../schemas/authSchemas.js';

const router = express.Router();
const userController = new UserController();

router.post('/login', 
  validateRequest(loginSchema),
  userController.loginUser
);

export default router;
