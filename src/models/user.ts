import { queryBuilder } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const getUserDetails = (): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["user_id","first_name","last_name","email","user_type"],
        from: "user_data"
    });
}

const getUserFullDetails = (user_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["first_name","last_name","email","address","user_type"],
        from: "user_data",
        where: [{columnName: "user_id", comOperator: "=",value: user_id}] 
    });
}


export { getUserDetails, getUserFullDetails};