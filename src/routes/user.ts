import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/userDetails', handleRequest("user","userDetails"));
router.get('/userDetails/:user_id', handleRequest("user","userFullDetails"));

export default router;