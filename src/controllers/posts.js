import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export const getAllPosts = async (req, res) => {
  try {
    const { term } = req.query;

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
    res.status(500).json({ error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const posts = req.body;

    if (Array.isArray(posts)) {

      for (const post of posts) {
        const { title, content, category } = post;

        if (!title || title.trim() === "") {
          return res.status(400).json({ error: "The title field is empty." });
        }

        if (!content || content.trim() === "") {
          return res.status(400).json({ error: "The content field is empty." });
        }

        if (!category || category.trim() === "") {
          return res.status(400).json({ error: "The category field is empty." });
        }
      }

      const newPost = await prisma.post.createMany({
        data: posts
      });
      res.status(201).json(newPost);

    } else {
      const { title, content, category } = posts;

      if (!title || title.trim() === "") {
        return res.status(400).json({ error: "The title field is empty." });
      }

      if (!content || content.trim() === "") {
        return res.status(400).json({ error: "The content field is empty." });
      }

      if (!category || category.trim() === "") {
        return res.status(400).json({ error: "The category field is empty." });
      }

      const newPost = await prisma.post.create({
        data: posts
      });
      res.status(201).json(newPost);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags } = req.body;

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, category, tags },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(400).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    res.sendStatus(204);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(400).json({ error: error.code });
  }
};

export const deleteAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.deleteMany({});
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
