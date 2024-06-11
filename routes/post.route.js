import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
	console.log("route works");
});

router.post("/test", (req, res) => {
	console.log("route works");
});

router.put("/test", (req, res) => {
	console.log("route works");
});

router.delete("/test", (req, res) => {
	console.log("route works");
});

export default router;
