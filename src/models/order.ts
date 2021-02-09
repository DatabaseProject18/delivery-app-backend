import { queryBuilder } from "../utils/db/database";

const pastOrders = (user_id: number) => {
    return queryBuilder({
        select: ["order_id", "order_date", "cost"],
        from: "order_table",
        where: [{ columnName: "user_id", comOperator: "=", value: user_id }]
    });
}

export { pastOrders };