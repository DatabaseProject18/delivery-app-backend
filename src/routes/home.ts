import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get("/", handleRequest("user", "getStudents"));
router.post("/", handleRequest("user", "insertStudent"));

export default router;
