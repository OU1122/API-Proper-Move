import prisma from "../lib/prisma.js";

// GET ALL POSTS

export const getPosts = async (req, res) => {
	const query = req.query;
	try {
		const posts = await prisma.post.findMany({
			where: {
				city: query.city || undefined,
				type: query.type || undefined,
				property: query.property || undefined,
				bedroom: parseInt(query.bedrrom) || undefined,
				price: {
					gte: parseInt(query.minPrice) || 0,
					lte: parseInt(query.maxPrice) || 10000000000,
				},
			},
		});

		res.status(200).json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to get posts",
		});
	}
};

// GET SINGLE POST (ID REQ)

export const getPost = async (req, res) => {
	const id = req.params.id;
	try {
		const post = await prisma.post.findUnique({
			where: { id },
			include: {
				postDetail: true,
				user: {
					select: {
						username: true,
						avatar: true,
					},
				},
			},
		});

		res.status(200).json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to get the post",
		});
	}
};

// ADD POST (MIDDLEWARE REQ)

export const addPost = async (req, res) => {
	const body = req.body;
	const tokenUserId = req.userId;
	console.log(body, tokenUserId);
	try {
		const newPost = await prisma.post.create({
			data: {
				...body.postData,
				userId: tokenUserId,
				postDetail: {
					create: body.postDetail,
				},
			},
		});

		res.status(200).json(newPost);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to create post",
		});
	}
};
// UPDATE POST (ID REQ)

export const updatePost = async (req, res) => {
	try {
		const res = await postMessage.prisma.f;
		res.status(200).json({ message: "User created succesfully" });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to get posts",
		});
	}
};

// DELETE SINGLE POST (ID REQ)

export const deletePost = async (req, res) => {
	const id = req.params.id;
	const tokenUserId = req.userId;

	try {
		const post = await prisma.post.findUnique({
			where: id,
		});

		if (post.userId !== tokenUserId) {
			return res.status(403).json({ message: "Not authorised" });
		}

		await prisma.post.delete({
			where: { id },
		});

		res.status(200).json({ message: "Post deleted" });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Failed to delete post",
		});
	}
};
