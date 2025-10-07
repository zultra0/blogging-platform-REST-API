import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deleteAllPosts,
  deletePost,
} from "../controllers/posts.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/", deleteAllPosts);
router.delete("/:id", deletePost);

export default router;