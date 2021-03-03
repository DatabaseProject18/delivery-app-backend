import { where } from "lodash/fp";
import { queryBuilder,call } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const sheduledTruckTrips = (id: number, type: string, date: string,isPast:string): Promise<ResponseResult> => {
    let name;
    type === 'driver' ? name = 'driver_assistant_name' : name = 'driver_name';

    let dateOp;
    isPast === 'true' ? dateOp = "<" : dateOp = ">=";

    //console.log(isPast)

    return queryBuilder({
        select: ["truck_schedule_id","date_time","truck_number",name,"destination","distance","average_time"],
        from: "truck_schedule_details",
        operator: "AND",
        where:[{columnName:"date_time", comOperator:dateOp, value:date},{columnName:type + "_id",comOperator:"=",value:id}]
    })
}

const truckTripDetails = (truckTrip_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: null,
        from: "truck_schedule_details",
        where:[{columnName:"truck_schedule_id", comOperator:"=", value:truckTrip_id}]
    })
}


const truckTripOrderDetails = (truckTrip_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: null,
        from: "order_delivery_details",
        where: [{ columnName: "truck_schedule_id", comOperator: "=", value: truckTrip_id }],
        order: {["order_status"]: "DESC",["meet_position"]: "ASC"}
    })
}


const allSheduledTruckTrips = (date: string): Promise<ResponseResult> => {
   
    return queryBuilder({
        select: ["truck_schedule_id","driver_id","driver_assistant_id","truck_id","date_time","average_time"],
        from: "truck_schedule_details",
        operator: "AND",
        where:[{columnName:"date_time", comOperator:">=", value:date}]
    })
}

export { sheduledTruckTrips , truckTripDetails,truckTripOrderDetails,allSheduledTruckTrips};
