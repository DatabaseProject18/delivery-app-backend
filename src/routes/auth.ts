import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.post("/login", handleRequest("auth", "login"));
router.post("/logout", handleRequest("auth", "logout"));
router.post("/register", handleRequest("auth", "register"));
router.post("/renewAccessToken", handleRequest("auth", "renewAccessToken"));

export default router;
