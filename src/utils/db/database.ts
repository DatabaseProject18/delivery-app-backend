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
  obj.sql += 'SELECT';
  if (data.select) {
    obj.sql += ' ?? ';
    obj.data.push(data.select);
  }
  else if(data.select===null){
    obj.sql+=' * '
  }
  return obj;
};

const from = (data: QueryData) => (obj: TransferObj): TransferObj => {
  obj.sql += 'FROM ?? ';
  obj.data.push(data.from);
  return obj;
};

const where = (data: QueryData) => (obj: TransferObj): TransferObj => { 
  if (data.where) {
    obj.sql += 'WHERE '
    for (let i = 0; i < data.where.length; i++) {
      obj.sql += `?? ${data.where[i].comOperator} ? `;
      obj.data.push(data.where[i].columnName);
      obj.data.push(data.where[i].value);
      if (i != data.where.length-1) {
        obj.sql += `${data.operator} `;
      }
    }
  }
  return obj;
}

const deleteTable = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if(data.delete){
    obj.sql += 'DELETE'
  }
  return obj;
}

const join = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if(data.join){
    obj.sql += "JOIN ";
    for(let i=0; i < Object.keys(data.join).length; i++){
      obj.sql += "?? USING(?) ";
      obj.data.push(Object.keys(data.join)[i]);
      obj.data.push(data.join[Object.keys(data.join)[i]]);
    }
  }
  return obj;
};

const order = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.order){
    obj.sql += "ORDER BY ";
    let tempArray = [];
    for (let [key, value] of Object.entries(data.order)) {
      tempArray.push("?? ??");
      obj.data.push(key);
      obj.data.push(value);
    }
    obj.sql += tempArray.join(", ");
  }
  return obj
};

const limit = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.limit){
    obj.sql += "LIMIT ";
    if (obj.data.length === 1){
      obj.sql += "??";
      obj.data.push(data.limit[0]);
    }else {
      obj.sql += "??, ??";
      obj.data.push(data.limit[0]);
      obj.data.push(data.limit[1]);
    }
  }
  return obj
};

