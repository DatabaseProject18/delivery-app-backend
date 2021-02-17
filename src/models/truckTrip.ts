import { where } from "lodash/fp";
import { queryBuilder,call } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const sheduledTruckTrips = (id: number, type: string, date: string): Promise<ResponseResult> => {
    let name;
    if (type === 'driver') {
        name = 'driver_assistant_name'
    }
    else {
        name = 'driver_name'
    }
    return queryBuilder({
        select: ["truck_schedule_id","date_time","truck_number",name,"destination","distance","average_time"],
        from: "truck_schedule_details",
        operator: "AND",
        where:[{columnName:"date_time", comOperator:">=",value:date},{columnName:type + "_id",comOperator:"=",value:id}]
    })
}


export { sheduledTruckTrips };
