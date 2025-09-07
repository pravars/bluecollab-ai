"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_js_1 = require("../controllers/UserController.js");
const validateRequest_js_1 = require("../middleware/validateRequest.js");
const authSchemas_js_1 = require("../schemas/authSchemas.js");
const router = express_1.default.Router();
const userController = new UserController_js_1.UserController();
router.post('/login', (0, validateRequest_js_1.validateRequest)(authSchemas_js_1.loginSchema), userController.loginUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map