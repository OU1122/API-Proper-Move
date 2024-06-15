import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		// HASH PW
		const hashedPassword = await bcrypt.hash(password, 10);
		console.log(hashedPassword);

		// CREATE USER IN DB

		const newUser = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		});
		console.log(newUser);

		res.status(201).json({ message: "User created succesfully" });
	} catch (err) {
		res.status(500).json({
			message: "Username or email is already registered.",
		});
	}
};

export const login = async (req, res) => {
	const { username, password } = req.body;

	try {
		// CHECK IF EXISTS

		const user = await prisma.user.findUnique({
			where: { username },
		});
		if (!user)
			return res.status(401).json({ message: "Invalid Credentials" });
		console.log(user);

		// CHECK IF PW CORRECT

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid)
			return res.status(401).json({ message: "Invalid Credentials" });

		// EXTRACT PW AND REST OF USER DATA

		const { password: userPassword, ...userData } = user;

		// GENERATE TOKEN & SEND

		const age = 1000 * 60 * 60 * 24 * 7;
		const token = jwt.sign(
			{
				id: user.id,
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: age }
		);
		// SEND COOKIE & USER DATA

		res.cookie("token", token, {
			httpOnly: true,
			maxAge: age,
		})
			.status(200)
			.json(userData);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Failed to login" });
	}
};
export const logout = (req, res) => {
	res.clearCookie("token").status(200).json({ message: "Logout succesful" });
};
