import express from "express";
import handleRequest from "../utils/req/requestHandler";
const router = express.Router();

router.patch('/account-enable', handleRequest("admin","enableAccount"));
router.patch('/account-disable', handleRequest("admin","disableAccount"));

export default router;
