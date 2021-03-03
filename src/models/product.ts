import { queryBuilder, call } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";
import config from "config";

const SearchProducts = (product_id: number): Promise<ResponseResult> => {
  return queryBuilder({
    select: [
      "product_name",
      "product_volume",
      "unit_price",
      "product_description",
      "discount",
    ],
    from: "product",
    operator: "AND",
    where: [{ columnName: "product_id", comOperator: "=", value: product_id }],
  });
};

const SearchFilterProducts = (category_id: number): Promise<ResponseResult> => {
  return queryBuilder({
    select: [
      "product_name",
      "product_volume",
      "unit_price",
      "product_description",
      "discount",
    ],
    from: "product",
    join: { product: "category_id", product_category: "category_id" },
    operator: "AND",
    where: [
      { columnName: "category_id", comOperator: "=", value: category_id },
    ],
  });
};

const getSearchByProductName = (
  offset: number,
  name: string
): Promise<ResponseResult> => {
  return call("get_result_of_search_by_product_name", [
    name,
    offset,
    config.get("items_per_page"),
  ]);
};

const getSearchByProductNameFilterCategory = (
  category: number,
  offset: number,
  name: string
): Promise<ResponseResult> => {
  return call("get_result_of_search_by_product_name_filter_by_category", [
    name,
    offset,
    config.get("items_per_page"),
    category,
  ]);
};

const getAllCategories = (): Promise<ResponseResult> => {
  return queryBuilder({
    select: null,
    from: "product_category",
  });
};

const getSearchResultCount = (name: string) => {
  return call("get_search_result_count", [name]);
};

const getCategorySearchResultCount = (name: string, category: number) => {
  return call("get_category_search_result_count", [name, category]);
};

export {
  SearchProducts,
  SearchFilterProducts,
  getSearchByProductName,
  getSearchByProductNameFilterCategory,
  getAllCategories,
  getSearchResultCount,
  getCategorySearchResultCount,
};
