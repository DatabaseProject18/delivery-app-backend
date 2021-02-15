import { where } from "lodash/fp";
import { queryBuilder,call } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";


const cart = (user_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["product_id","product_name","product_description","quantity","unit_price","discount","stock"],
        from: "cart",
        join: { "product": "product_id" },
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id }]
    });
}

const updateCartQuantity = (user_id: number, product_id: number, quantity:string): Promise<ResponseResult> => {
    return queryBuilder({
        update: { tableName: 'cart', values: { "quantity": String(quantity) } },
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "product_id", comOperator: "=", value: product_id }]
    });
}

const deleteFromCart = (user_id: number, order_id:number): Promise<ResponseResult> => {
    return queryBuilder({
        update: { tableName: 'order_table', values: { "order_status": "deleted" } },
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

export {cart,updateCartQuantity,deleteFromCart}