import { queryBuilder,call } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";


const getTruckRouteIds = (store_manager_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["truck_route_id"],
        from: "truck_schedule",
        where: [{ columnName: "store_manager_id", comOperator: "=", value: store_manager_id }]

    });
}

const getTruckRoutes = (store_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["truck_route_id","town","meet_position"],
        from: "covered_area",
        join:{truck_route:"truck_route_id",train_route:"train_route_id"},
        where: [{columnName: "store_id", comOperator: "=",value: store_id}],
    });
}

const getTruckId = (store_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["truck_id","registration_no","truck_capacity"],
        from: "truck",
        where: [{columnName: "store_id", comOperator: "=",value: store_id}]
    });
}

// const createTruckTrip = (req: Object): Promise<ResponseResult> => {
//     console.log(req);
//     return queryBuilder({
//         insert: {
//             tableName: "truck_schedule",
//             columns: ["truck_route_id","truck_id","date_time","store_manager_id","driver_id","driver_assistant_id"],
//             values: [Object.values(req)],
//         }
//     });
// }

const createTruckTrip = (data: Object): Promise<ResponseResult> => {
    return call("insert_new_truck_trip",[JSON.stringify(data)]);
}

const createScheduledOrder = (req: Object): Promise<ResponseResult> => {
    console.log(req);
    return queryBuilder({
        insert: {
            tableName: "scheduled_order",
            columns: ["order_id","truck_schedule_id"],
            values: Object.values(req),
        }
    });
}

const truckRouteByID = (truck_route_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["town"],
        from: "covered_area",
        where: [{ columnName: "truck_route_id", comOperator: "=", value: truck_route_id }],
        order: {["meet_position"]: "ASC"}
    });

}
const getStoreIDByStoreManagerID = (store_manager_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["store_id"],
        from: "store_manager",
        where: [{columnName: "store_manager_id", comOperator: "=", value: store_manager_id}]
    });
}

export {getTruckRouteIds, getTruckRoutes, getTruckId, createTruckTrip,truckRouteByID,getStoreIDByStoreManagerID, createScheduledOrder};
