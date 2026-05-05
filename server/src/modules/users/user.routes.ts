import { Router } from "express";
import { getUsers } from "./user.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.get("/", requireAuth, getUsers);

export default router;
