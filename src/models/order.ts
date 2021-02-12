import { where } from "lodash/fp";
import { queryBuilder } from "../utils/db/database";

const pastOrders = (user_id: number) => {
    return queryBuilder({
        select: ["order_id", "order_date", "cost","order_status"],
        from: "order_table",
        operator:"AND",
        where: [{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_status", comOperator: "!=", value: "deleted" }]
    });
}

const pastOrder = (user_id: number, order_id:number) => {
    return queryBuilder({
        select: null,
        from: "ordered_product",
        join: { "product": "product_id", "order_table": "order_id" },
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const deleteFromCart = (user_id: number, order_id:number) => {
    return queryBuilder({
        update: { tableName: 'order_table', values: { "order_status": "deleted" } },
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const CancelAnOrder = (user_id: number, order_id:number) => {
    return queryBuilder({
        update: { tableName: 'order_table', values: { "order_status": "canceled" } },
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const orderStatus = (user_id: number, order_id:number) => {
    return queryBuilder({
        select: ["order_status"],
        from: "order_table",
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const CreateAnOrder = (user_id: number) => {
    return queryBuilder({
        insert: { tableName: 'order_table', columns: ['order_id', 'order_date', 'delivery_date', 'customer_id', 'route_id', 'cost', 'order_status'], values: ['object']},
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: "user_id"}]        
    })
}

export { pastOrders, pastOrder, deleteFromCart, CancelAnOrder, orderStatus, CreateAnOrder };