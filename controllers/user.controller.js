import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// GET ALL USERS

export const getUsers = async (req, res) => {
	try {
		const users = await prisma.user.findMany();

		res.status(200).json(users);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Failed to get users" });
	}
};

// GET USER

export const getUser = async (req, res) => {
	const userId = req.params.id;

	console.log(userId);
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		res.status(200).json(user);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Failed to get user" });
	}
};

// UPDATE USER

export const updateUser = async (req, res) => {
	const userId = req.params.id;
	const tokenUserId = req.userId;
	const { password, avatar, ...UserInputs } = req.body;

	let updatedPassword = null;
	// COMPARE ID
	if (userId !== tokenUserId) {
		return res.status(403).json({ message: "Not authorized" });
	}
	try {
		if (password) {
			updatedPassword = await bcrypt.hash(password, 10);
		}
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				...UserInputs,
				...(updatedPassword && { password: updatedPassword }),
				...(avatar && { avatar }),
			},
		});

		// SPREAD UPDATED INFO & PW
		const { password: updatedPasswordResponse, ...updatedUserResponse } =
			updatedUser;

		// SEND UPDATED INFO WITHOUT PW
		res.status(200).json(updatedUserResponse);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Failed to update User" });
	}
};

export const deleteUser = async (req, res) => {
	const userId = req.params.id;
	const tokenUserId = req.userId;

	if (userId !== tokenUserId) {
		return res.status(403).json({ message: "Not authorized" });
	}

	try {
		const user = await prisma.user.delete({
			where: {
				id: userId,
			},
		});

		res.status(200).json({ message: "User deleted." });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Failed to get user" });
	}
};

// SAVE POST

export const savePost = async (req, res) => {
	const postId = req.body.postId;
	const tokenUserId = req.userId;

	try {
		const savedPost = await prisma.savedPost.findUnique({
			where: {
				userId_postId: {
					userId: tokenUserId,
					postId,
				},
			},
		});
		if (savedPost) {
			await prisma.savedPost.delete({
				where: {
					id: savedPost.id,
				},
			});
			res.status(200).json({ message: "Removed from saved posts" });
		} else {
			await prisma.savedPost.create({
				data: {
					userId: tokenUserId,
					postId,
				},
			});
			res.status(200).json({ message: "Added to saved posts" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Failed to save post" });
	}
};
export const profilePosts = async (req, res) => {
	const tokenUserId = req.userId;

	try {
		/* const userPosts = await prisma.post.findMany({
			where: { userId: tokenUserId },
		});
		const saved = await prisma.savedPost.findMany({
			where: { userId: tokenUserId },
			include: { post: true },
		});

		const savedPosts = saved.map((item) => item.post); */

		res.status(200).json({ message: "success" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Failed to get posts" });
	}
};
