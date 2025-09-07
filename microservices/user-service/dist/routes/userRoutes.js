"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_js_1 = require("../controllers/UserController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const validateRequest_js_1 = require("../middleware/validateRequest.js");
const userSchemas_js_1 = require("../schemas/userSchemas.js");
const router = express_1.default.Router();
const userController = new UserController_js_1.UserController();
// Public routes
router.post('/register', (0, validateRequest_js_1.validateRequest)(userSchemas_js_1.createUserSchema), userController.createUser);
router.post('/login', userController.loginUser);
// Protected routes
router.use(authMiddleware_js_1.authMiddleware);
router.get('/profile', userController.getUserProfile);
router.put('/profile', (0, validateRequest_js_1.validateRequest)(userSchemas_js_1.updateUserSchema), userController.updateUserProfile);
router.get('/:id', (0, validateRequest_js_1.validateRequest)(userSchemas_js_1.getUserSchema), userController.getUserById);
router.put('/:id', (0, validateRequest_js_1.validateRequest)(userSchemas_js_1.updateUserSchema), userController.updateUser);
router.delete('/:id', (0, validateRequest_js_1.validateRequest)(userSchemas_js_1.getUserSchema), userController.deleteUser);
router.get('/', userController.getUsers);
router.post('/verify-email', userController.verifyEmail);
router.post('/verify-phone', userController.verifyPhone);
router.post('/change-password', userController.changePassword);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map