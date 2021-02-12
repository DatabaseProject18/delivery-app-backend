import git { Request, Response } from "express";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";

const assignOrderToTrain = (): RHandler => {
    const rHandlerData: RHandler = {
        authSchema: {
            hasToken: false,
        },
        handlers: [
            
        ]
    };

    return rHandlerData;
};