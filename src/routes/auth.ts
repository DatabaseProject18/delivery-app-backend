import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.post("/login", handleRequest("auth", "login"));
router.delete("/logout", handleRequest("auth", "logout"));
router.post("/register", handleRequest("auth", "register"));
router.get("/renewAccessToken", handleRequest("auth", "renewAccessToken"));

export default router;
