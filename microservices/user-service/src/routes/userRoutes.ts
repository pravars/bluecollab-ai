import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createUserSchema, updateUserSchema, getUserSchema } from '../schemas/userSchemas.js';

const router = express.Router();
const userController = new UserController();

// Public routes
router.post('/register', 
  validateRequest(createUserSchema),
  userController.createUser
);

router.post('/login', 
  userController.loginUser
);

// Protected routes
router.use(authMiddleware);

router.get('/profile', 
  userController.getUserProfile
);

router.put('/profile', 
  validateRequest(updateUserSchema),
  userController.updateUserProfile
);

router.get('/:id', 
  validateRequest(getUserSchema),
  userController.getUserById
);

router.put('/:id', 
  validateRequest(updateUserSchema),
  userController.updateUser
);

router.delete('/:id', 
  validateRequest(getUserSchema),
  userController.deleteUser
);

router.get('/', 
  userController.getUsers
);

router.post('/verify-email', 
  userController.verifyEmail
);

router.post('/verify-phone', 
  userController.verifyPhone
);

router.post('/change-password', 
  userController.changePassword
);

router.post('/forgot-password', 
  userController.forgotPassword
);

router.post('/reset-password', 
  userController.resetPassword
);

export default router;
