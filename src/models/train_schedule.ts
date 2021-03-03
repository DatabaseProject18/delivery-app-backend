import { queryBuilder, call } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const schedule_train = (order_id: number, train_time_table_id: number, delivery_manager_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        insert: {
            tableName: "train_schedule",
            columns: [
                "order_id",
                "train_time_table_id",
                "delivery_manager_id"
            ],
            values: [
                order_id,
                train_time_table_id,
                delivery_manager_id
            ],
        },
    });
};

export {
    schedule_train
};
