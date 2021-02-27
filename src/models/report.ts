import { queryBuilder, call } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const getYearsIncome = (): Promise<ResponseResult> => {
  return call("get_years_income");
};

const getQuarterlyIncome = (year: string): Promise<ResponseResult> => {
  return call("get_quarterly_income_of_year", [year]);
};

const getBasicsOfOrderInQuarter = (
  year: string,
  quarter: string
): Promise<ResponseResult> => {
  let date_array: Array<string>;
  switch (quarter) {
    case "1":
      date_array = [`${year}-01-01`, `${year}-03-31`];
      break;
    case "2":
      date_array = [`${year}-04-01`, `${year}-06-30`];
      break;
    case "3":
      date_array = [`${year}-07-01`, `${year}-09-30`];
      break;
    case "4":
      date_array = [`${year}-10-01`, `${year}-12-31`];
      break;
    default:
      date_array = ["", ""];
  }
  return call("get_quarterly_basic_order_details", date_array);
};

const getOrderCountOfProductInYear = (
  year: string
): Promise<ResponseResult> => {
  return call("get_order_count_of_product_in_year", [year]);
};

const getOrderCountOfProduct = (): Promise<ResponseResult> => {
  return call("get_order_count_of_product");
};

const getIncomeBasedOnCitiesRoutes = (): Promise<ResponseResult> => {
  return call("get_income_according_to_routes_cities");
};

const getIncomeBasedOnCitiesRoutesInYear = (
  year: string
): Promise<ResponseResult> => {
  return call("get_income_according_to_routes_cities_year", [year]);
};

const getDriverWorkingHours = (): Promise<ResponseResult> => {
  return call("get_working_hours_of_drivers");
};

const getDriverWorkingHoursInYear = (year: string): Promise<ResponseResult> => {
  return call("get_working_hours_of_drivers_in_year", [year]);
};

const getDriverWorkingHoursInYearInMonth = (
  year: string,
  month: string
): Promise<ResponseResult> => {
  return call("get_working_hours_of_drivers_in_year_in_month", [year, month]);
};

const getDriverAssistantWorkingHours = (): Promise<ResponseResult> => {
  return call("get_working_hours_of_driver_assistants");
};

const getDriverAssistantWorkingHoursInYear = (
  year: string
): Promise<ResponseResult> => {
  return call("get_working_hours_of_driver_assistants_in_year", [year]);
};

const getDriverAssistantWorkingHoursInYearInMonth = (
  year: string,
  month: string
): Promise<ResponseResult> => {
  return call("get_working_hours_of_driver_assistants_in_year_in_month", [
    year,
    month,
  ]);
};

const getTruckUsedHours = (): Promise<ResponseResult> => {
  return call("get_used_hours_of_trucks");
};

const getTruckUsedHoursInYear = (year: string): Promise<ResponseResult> => {
  return call("get_used_hours_of_trucks_in_year", [year]);
};

const getTruckUsedHoursInYearInMonth = (
  year: string,
  month: string
): Promise<ResponseResult> => {
  return call("get_used_hours_of_trucks_in_year_in_month", [year, month]);
};

const getCustomerOrder = (): Promise<ResponseResult> => {
  return call("get_seles_of_each_customer");
};

const getCustomerOrderInYear = (year: string): Promise<ResponseResult> => {
  return call("get_seles_of_each_customer_in_year", [year]);
};

const getCustomerBasicOrderDetails = (
  customerId: number
): Promise<ResponseResult> => {
  return call("get_customer_basic_order_details",[customerId]);
};

export {
  getYearsIncome,
  getQuarterlyIncome,
  getBasicsOfOrderInQuarter,
  getOrderCountOfProduct,
  getOrderCountOfProductInYear,
  getIncomeBasedOnCitiesRoutes,
  getIncomeBasedOnCitiesRoutesInYear,
  getDriverWorkingHours,
  getDriverWorkingHoursInYear,
  getDriverWorkingHoursInYearInMonth,
  getDriverAssistantWorkingHours,
  getDriverAssistantWorkingHoursInYear,
  getDriverAssistantWorkingHoursInYearInMonth,
  getTruckUsedHours,
  getTruckUsedHoursInYear,
  getTruckUsedHoursInYearInMonth,
  getCustomerOrder,
  getCustomerOrderInYear,
  getCustomerBasicOrderDetails,
};
