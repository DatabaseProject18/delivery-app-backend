import { queryBuilder, call } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";
//import _ from "lodash";

const getDriverName = async (truck_route_id: number, store_id: number,start_time: string, end_time: string): Promise<ResponseResult> => {
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
         operator: "AND",
        where: [{columnName: "user_type", comOperator: "=",value: "Driver"},{columnName: "store_id", comOperator: "=",value: store_id}] 
    }); 

    const freeDriverDetails = allDriverDetails.data.multiple.filter((elem) => !busyDriverIds.find(({ driver_id }) => elem.driver_id === driver_id));
    const getDriversByWorkingHours = await call("get_drivers_who_are_exceeding_total_hours",[truck_route_id,start_time]);
    //console.log(getDriversByWorkingHours.data.multiple);
    //console.log(getDriversByWorkingHours.error);
    if(getDriversByWorkingHours.error){
        allDriverDetails.data.multiple = freeDriverDetails;
    }else{
        const workingDrivers = freeDriverDetails.filter((elem) => !getDriversByWorkingHours.data.multiple.find(({ driver_id}) => elem.driver_id === driver_id));
        allDriverDetails.data.multiple = workingDrivers;
    }
    //const workingDrivers = freeDriverDetails.filter((elem) => !getDriversByWorkingHours.data.multiple.find(({ driver_id}) => elem.driver_id === driver_id));
    //allDriverDetails.data.multiple = workingDrivers;  
    //allDriverDetails.data.multiple = freeDriverDetails;
    
    

    return allDriverDetails;    
}

const getStoreIDByStoreManagerID = (store_manager_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["store_id"],
        from: "store_manager",
        where: [{columnName: "store_manager_id", comOperator: "=", value: store_manager_id}] 
    });
}

const getDriverDetails = (store_id:number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["driver_id","first_name","last_name","email"],
        from: "user_data",
        join: { "staff": "user_id", "driver": "staff_id" },
        operator: "AND",
        where: [{columnName: "user_type", comOperator: "=",value: "driver"},{columnName: "store_id", comOperator: "=",value: store_id}]
    });
}

const getDriverFullDetails = (driver_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["first_name","last_name","email","staff_id","store_id","total_work_hours"],
        from: "user_data",
        join: { "staff": "user_id", "driver": "staff_id" },
        operator: "AND",
        where: [{columnName: "driver_id", comOperator: "=",value: driver_id}, {columnName: "user_type", comOperator: "=", value: "driver"}] 
    });
}

export { getDriverName, getStoreIDByStoreManagerID,getDriverDetails, getDriverFullDetails };