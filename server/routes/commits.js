import express from "express"
import { getRepoCommits } from "../controllers/commitController.js";

const router = express.Router();

// This matches /api/commits/:owner/:repo
// But since we mount it at /api/commits in server.js, we just need the rest here
router.get('/:owner/:repo',getRepoCommits)


export default router;
