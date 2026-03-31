import { Router } from "express";
import { getUsers } from "../controllers/userController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, getUsers);

export default router;
