const sql = {
  select: ["name", "age"],
  insert: {
    name: "Dilshan",
    age: "23",
  },
  where: {},
};

interface TransferObj {
  sql: String;
  data: Array<any>;
}

interface WhereExp {
  columnName: String;
  comOperator: String;
  value: String;
}

interface QueryData {
  select?: Array<String> | null;
  from: String;
  operator?: String;
  where?: Array<WhereExp>;
  insert?: Array<String> | null;
  update?: object;
  delete?: boolean;
  join?: object;
  order?: object;
  limit?: Array<number>;
}

// function select(sql:String):String{
//     if (sql){

//     }
//     return "";
// }

// const selct = data => a => b => c => {

// }
// selct("df");

// const fun = data => obj => {

// }

// obj={
//     sql:"",
//     data:[[],{}]
// }

const select = (data: QueryData) => (obj: TransferObj): TransferObj => {
  //return statement same as this
  const b: TransferObj = { sql: "", data: [] };
  return b;
};
