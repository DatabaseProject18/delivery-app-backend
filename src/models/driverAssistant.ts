import { queryBuilder } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const getDriverAssistantId = (truck_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["driver_assistant_id"],
        from: "truck_schedule",
        join: { "driver_assistant": "driver_assistant_id"},
        operator: "AND",
        where: [{ columnName: "truck_id", comOperator: "=", value: truck_id }, { columnName: "total_work_hours", comOperator: "<", value: 60 }]   
    });
}

const getDriverAssistantName = (driver_assistant_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["first_name","last_name","user_id"],
        from: "user_data",
        where: [{ columnName: "user_id", comOperator: "=", value: driver_assistant_id }]   
    });
}

const getDriverAssistantIds = (): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["driver_assistant_id"],
        from: "driver_assistant"  
    });
}

const getDriverAssistantDetails = (driver_assistant_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["first_name","last_name","email","user_type"],
        from: "user_data",
        where: [{columnName: "user_id", comOperator: "=",value: driver_assistant_id}]  
    });
}

const getDriverAssistantFullDetails = (driver_assistant_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: null,
        from: "user_data",
        where: [{columnName: "user_id", comOperator: "=",value: driver_assistant_id}] 
    });
}

export { getDriverAssistantId, getDriverAssistantName, getDriverAssistantIds, getDriverAssistantDetails, getDriverAssistantFullDetails };