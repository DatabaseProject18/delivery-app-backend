import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.get('/userDetails', handleRequest("user","userDetails"));
router.get('/userDetails/:user_id', handleRequest("user","userFullDetails"));
router.get('/users-details-status', handleRequest("user","usersDetailsWithAccountStatus"));

export default router;
