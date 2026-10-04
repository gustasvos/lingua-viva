import { Router } from "express";

import * as authController from "./auth.controller";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google", authController.loginWithGoogle);
router.post("/logout", authenticate, authController.logout);
router.post("/refresh", authController.refresh);

export default router;