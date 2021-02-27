import { queryBuilder } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const getDriverName = async (start_time: Date, end_time: Date): Promise<ResponseResult> => {
    const presentConsecutiveDrivers = await queryBuilder({
        select: ["driver_id"],
        from: "truck_schedule",
        operator: "AND",
        where: [{ columnName: "date_time", comOperator: ">", value: start_time }, { columnName: "date_time", comOperator: "<", value: end_time }]   
    });

    const pastConsecutiveDrivers = await queryBuilder({
        select: ["driver_id"],
        from: "truck_schedule",
        where: [{ columnName: "date_time", comOperator: "<=", value: start_time }],
        order: {["date_time"]: "DESC"},
        limit: [1] 
    });

    const futureConsecutiveDrivers = await queryBuilder({
        select: ["driver_id"],
        from: "truck_schedule",
        where: [{ columnName: "date_time", comOperator: ">=", value: end_time }],
        order: {["date_time"]: "ASC"},
        limit: [1] 
    });
    
    let busyDriverIds = [];
    
    if(presentConsecutiveDrivers.data){
        presentConsecutiveDrivers.data.multiple.forEach(function (value) {
            busyDriverIds.push(value);
          });
    }

    if(pastConsecutiveDrivers.data){
        busyDriverIds.push(pastConsecutiveDrivers.data.multiple[0]);
    }

    if(futureConsecutiveDrivers.data){
        busyDriverIds.push(futureConsecutiveDrivers.data.multiple[0])
    }

    const allDriverDetails = await queryBuilder({
        select: ["first_name","last_name","driver_id"],
        from: "user_data",
        join: { "staff": "user_id", "driver": "staff_id" },
        where: [{columnName: "user_type", comOperator: "=",value: "Driver"}] 
    }); 

    const freeDriverDetails = allDriverDetails.data.multiple.filter((elem) => !busyDriverIds.find(({ driver_id }) => elem.driver_id === driver_id));

    allDriverDetails.data.multiple = freeDriverDetails;
    return allDriverDetails;    
}

const getDriverDetails = (): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["driver_id","first_name","last_name","email"],
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


export { getDriverName, getDriverDetails, getDriverFullDetails };