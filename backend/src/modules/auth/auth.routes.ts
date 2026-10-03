import { Router } from "express";

import * as authController from "./auth.controller";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.post("/login", authController.login);
router.post("/logout", authenticate, authController.logout);

export default router;