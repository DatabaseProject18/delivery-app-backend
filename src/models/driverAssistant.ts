import { queryBuilder } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const getDriverAssistantName = async (store_id:number,start_time: string, end_time: string): Promise<ResponseResult> => {
    const presentConsecutiveDriverAssistants = await queryBuilder({
        select: ["driver_assistant_id"],
        from: "truck_schedule",
        operator: "AND",
        where: [{ columnName: "date_time", comOperator: ">", value: start_time }, { columnName: "date_time", comOperator: "<", value: end_time }]   
    });
    //console.log(getDriverAssistantName);
    const pastConsecutiveDriverAssistants = await queryBuilder({
        select: ["driver_assistant_id"],
        from: "truck_schedule",
        where: [{ columnName: "date_time", comOperator: "<=", value: start_time }],
        order: {["date_time"]: "DESC"},
        limit: [1] 
    });

    const futureConsecutiveDriverAssistants = await queryBuilder({
        select: ["driver_assistant_id"],
        from: "truck_schedule",
        where: [{ columnName: "date_time", comOperator: ">=", value: end_time }],
        order: {["date_time"]: "ASC"},
        limit: [1] 
    });
    
    let busyDriverAssistantIds = [];
    
    if(presentConsecutiveDriverAssistants.data){
        presentConsecutiveDriverAssistants.data.multiple.forEach(function (value) {
            busyDriverAssistantIds.push(value);
          });    
    }

    if(pastConsecutiveDriverAssistants.data){
        pastConsecutiveDriverAssistants.data.multiple.forEach(function (value) {
            busyDriverAssistantIds.push(value);
          });
    }

    if(futureConsecutiveDriverAssistants.data){
        futureConsecutiveDriverAssistants.data.multiple.forEach(function (value) {
            busyDriverAssistantIds.push(value);
          });
    }

    const allDriverAssistantDetails = await queryBuilder({
        select: ["first_name","last_name","driver_assistant_id"],
        from: "user_data",
        join: { "staff": "user_id", "driver_assistant": "staff_id" },
         operator: "AND",
        where: [{columnName: "user_type", comOperator: "=",value: "driver_assistant"},{columnName: "store_id", comOperator: "=",value: store_id}] 
    }); 


    const freeDriverAssistantDetails = allDriverAssistantDetails.data.multiple.filter((elem) => !busyDriverAssistantIds.find(({ driver_assistant_id }) => elem.driver_assistant_id === driver_assistant_id));
    
    allDriverAssistantDetails.data.multiple = freeDriverAssistantDetails;
    return allDriverAssistantDetails;    
}

const getStoreIDByStoreManagerID = (store_manager_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["store_id"],
        from: "store_manager",
        where: [{columnName: "store_manager_id", comOperator: "=", value: store_manager_id}] 
    });
}

const getDriverAssistantDetails = (store_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["first_name","last_name","email","driver_assistant_id"],
        from: "user_data",
        join: { "staff": "user_id", "driver_assistant": "staff_id" },
        operator: "AND",
        where: [{columnName: "user_type", comOperator: "=",value: "driver_assistant"},{columnName: "store_id", comOperator: "=",value: store_id}]
    });
}

const getDriverAssistantFullDetails = (driver_assistant_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["first_name","last_name","email","staff_id","store_id","total_work_hours"],
        from: "user_data",
        join: { "staff": "user_id", "driver_assistant": "staff_id" },
        operator: "AND",
        where: [{columnName: "driver_assistant_id", comOperator: "=",value: driver_assistant_id}, {columnName: "user_type", comOperator: "=",value: "driver_assistant"}] 
    });
}

export { getDriverAssistantName, getStoreIDByStoreManagerID, getDriverAssistantDetails, getDriverAssistantFullDetails };