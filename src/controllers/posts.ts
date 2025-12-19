import { PrismaClient } from "../../generated/prisma/client.js";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const termParam = req.query.term;
    const term = typeof termParam === "string" ? termParam : undefined;

    let posts;

    if (term) {
      posts = await prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: term,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: term,
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: term,
                mode: "insensitive",
              },
            },
          ],
        },
      });
    } else {
      posts = await prisma.post.findMany({});
    }

    res.status(200).json({
      posts,
      total: posts.length,
      searchTerm: term || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json({ error: message });
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = req.body;

    if (Array.isArray(posts)) {

      for (const post of posts) {
        const { title, content, category } = post;

        if (!title || title.trim() === "") {
          res.status(400).json({ error: "The title field is empty." });
          return;
        }

        if (!content || content.trim() === "") {
          res.status(400).json({ error: "The content field is empty." });
          return;
        }

        if (!category || category.trim() === "") {
          res.status(400).json({ error: "The category field is empty." });
          return;
        }
      }

      const newPost = await prisma.post.createMany({
        data: posts
      });
      res.status(201).json(newPost);

    } else {
      const { title, content, category } = posts;

      if (!title || title.trim() === "") {
        res.status(400).json({ error: "The title field is empty." });
        return;
      }

      if (!content || content.trim() === "") {
        res.status(400).json({ error: "The content field is empty." });
        return;
      }

      if (!category || category.trim() === "") {
        res.status(400).json({ error: "The category field is empty." });
        return;
      }

      const newPost = await prisma.post.create({
        data: posts
      });
      res.status(201).json(newPost);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json({ error: message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags } = req.body;

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, category, tags },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json({ error: message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    res.sendStatus(204);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json({ error: message });
  }
};

export const deleteAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.deleteMany({});
    res.sendStatus(204);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(400).json({ error: message });
  }
};
