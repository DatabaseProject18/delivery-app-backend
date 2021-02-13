import { queryBuilder } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const getDriverId = (truck_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["driver_id"],
        from: "truck_schedule",
        join: { "driver": "driver_id"},
        operator: "AND",
        where: [{ columnName: "truck_id", comOperator: "=", value: truck_id }, { columnName: "total_work_hours", comOperator: "<", value: 40 }]   
    });
}

const getDriverName = (driver_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["first_name","last_name","user_id"],
        from: "user_data",
        where: [{ columnName: "user_id", comOperator: "=", value: driver_id }]   
    });
}

const getDriverIds = (): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["driver_id"],
        from: "driver"  
    });
}

const getDriverDetails = (driver_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["first_name","last_name","email","user_type"],
        from: "user_data",
        where: [{columnName: "user_id", comOperator: "=",value: driver_id}]  
    });
}

const getDriverFullDetails = (driver_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: null,
        from: "user_data",
        where: [{columnName: "user_id", comOperator: "=",value: driver_id}] 
    });
}


export { getDriverId, getDriverName, getDriverIds, getDriverDetails, getDriverFullDetails};