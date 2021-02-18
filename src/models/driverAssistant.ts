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


const getDriverAssistantDetails = (): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["first_name","last_name","email","driver_assistant_id"],
        from: "user_data",
        join: { "staff": "user_id", "driver_assistant": "staff_id" },
        where: [{columnName: "user_type", comOperator: "=",value: "Driver Assistant"}]
    });
}

const getDriverAssistantFullDetails = (driver_assistant_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: null,
        from: "user_data",
        join: { "staff": "user_id", "driver_assistant": "staff_id" },
        operator: "AND",
        where: [{columnName: "user_id", comOperator: "=",value: driver_assistant_id}, {columnName: "user_type", comOperator: "=",value: "Driver Assistant"}] 
    });
}

export { getDriverAssistantId, getDriverAssistantName, getDriverAssistantDetails, getDriverAssistantFullDetails };