var express = require("express");
var { graphqlHTTP } = require("express-graphql");
const data = require("./profile.json");
const { columns } = require("./columns.js");
var { buildSchema } = require("graphql");
const cors = require("cors");
const app = express();
const {
  filterList,
  getStackedColumns,
  isColHidden,
  DEFAULT_LG_ORDER_MAP,
  DEFAULT_SG_ORDER_MAP,
  formatAggregate,
  sortList,
} = require("./utility");

app.use(cors());

// GraphQL Schema
const schema = buildSchema(`
    input Sorted {
      name: String
      direction: String
    }

    input Datamanager {
      params: String
      sorted: [Sorted]
      skip: Int
      take: Int
      where: String
    }
    
    type MyData {
      areaId: String
      order: Int
      sg: String
      lg: String
      segmentCode: Int
      segmentName: String
      varCode: String
      varDesc: String
      count: Float
      percentComp: Float
      baseCount: Float
      basePercent: Float
      percentPen: Float
      index: Float
    }

    type MyColumn {
      field: String
      headerText: String
      width: String
      textAlign: String
      id: Int
      isNumeric: Boolean
      isHidable: Boolean
      hasAccessor: Boolean
      precision: Int
      columns: [MyColumn]
      headerTemplate: String
    }

    type ReturnType {
      result: [MyData]
      totalRecord: Int
    }

    type Query {
      myDataList(datamanager: Datamanager): ReturnType
      myColumns(datamanager: Datamanager): [MyColumn]
    }
`);

// Get data list
function getDataList({ datamanager }) {
  let result = [...data];
  let totalRecord = result.length;
  let group;

  if (datamanager.params) {
    // fetch data by report input
    const params = JSON.parse(datamanager.params);
    // const { reportInput, group } = params;
    group = params.group
    // console.log("reportInput", reportInput);

    if (group) {
      if (group === "sg") {
        console.log(group);
        result.sort(
          (a, b) => DEFAULT_SG_ORDER_MAP[a.sg] - DEFAULT_SG_ORDER_MAP[b.sg]
        );
      } else if (group === "lg") {
        result.sort(
          (a, b) => DEFAULT_LG_ORDER_MAP[a.lg] - DEFAULT_LG_ORDER_MAP[b.lg]
        );
      }

      // Add extra grouping rows
      result = formatAggregate(result, group, columns, datamanager)
    }
  }

  // perform filtering
  if (datamanager.where && !group) {
    result = filterList(result, JSON.parse(datamanager.where));
    totalRecord = result.length;
  }

  // perform paging
  if (datamanager.skip !== undefined && datamanager.take !== undefined) {
    result = result.slice(
      datamanager.skip,
      datamanager.skip + datamanager.take
    );
  }

  // perform sorting
  if (datamanager.sorted && !group) {
    result = sortList(datamanager, result)
  }

  return { result, totalRecord };
}

const getColumns = ({ datamanager }) => {
  let result = [...columns];

  if (datamanager.params) {
    // fetch data by report input
    const params = JSON.parse(datamanager.params);
    const { reportType, hideColInfo, withStackedHeader, reportInputsInfo } =
      params;

    // get columns by reportType

    if (withStackedHeader) {
      result = getStackedColumns(result, hideColInfo, reportInputsInfo);
    } else {
      result = result.filter((col) => !isColHidden(col, hideColInfo));
    }
  }

  return result;
};

// Resolver
const root = {
  myDataList: getDataList,
  myColumns: getColumns,
};

// bind express with graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
