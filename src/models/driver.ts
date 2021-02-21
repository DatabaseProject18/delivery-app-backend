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


const getDriverDetails = (): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["first_name","last_name","email","driver_id"],
        from: "user_data",
        join: { "staff": "user_id", "driver": "staff_id" },
        where: [{columnName: "user_type", comOperator: "=",value: "Driver"}]
    });
}

const getDriverFullDetails = (driver_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: null,
        from: "user_data",
        join: { "staff": "user_id", "driver": "staff_id" },
        operator: "AND",
        where: [{columnName: "driver_id", comOperator: "=",value: driver_id}, {columnName: "user_type", comOperator: "=", value: "Driver"}] 
    });
}


export { getDriverId, getDriverName, getDriverDetails, getDriverFullDetails};