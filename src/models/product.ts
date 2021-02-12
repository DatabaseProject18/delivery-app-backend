import { where } from "lodash/fp";
import { queryBuilder } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const SearchProducts = (product_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["product_name", "product_volume", "unit_price","product_description", "discount"],
        from: "product",
        operator:"AND",
        where: [{ columnName: "product_id", comOperator: "=", value: product_id }]
    });
}

const SearchFilterProducts = (category_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["product_name", "product_volume", "unit_price","product_description", "discount"],
        from: "product",
        join: { "product": "category_id", "product_category": "category_id" },
        operator:"AND",
        where:[{ columnName: "category_id", comOperator: "=", value: category_id }]
    });
}

export { SearchProducts, SearchFilterProducts }