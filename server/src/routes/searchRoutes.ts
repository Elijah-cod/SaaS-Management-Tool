import { Router } from "express";
import { searchWorkspace } from "../controllers/searchController";

const router = Router();

router.get("/", searchWorkspace);

export default router;
