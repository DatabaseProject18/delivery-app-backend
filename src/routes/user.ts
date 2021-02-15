import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/user', handleRequest("user","userDetails"));
router.get('/user/:user_id', handleRequest("user","userFullDetails"));

export default router;