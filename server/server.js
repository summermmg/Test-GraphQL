var express = require("express");
var { graphqlHTTP } = require("express-graphql");
const data = require("./profile.json");
var { buildSchema } = require("graphql");
const cors = require("cors");
const app = express();
const { filterList } = require("./utility");

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
      index: Int
    }

    type ReturnType {
      result: [MyData]
      totalRecord: Int
    }

    type Query {
      myDataList(datamanager: Datamanager): ReturnType
    }
`);

// Get data list
function getDataList({ datamanager }) {
  let result = [...data];
  let totalRecord = result.length;

  if (datamanager.params) {
    // fetch data by report input
    const params = JSON.parse(datamanager.params);
    const { reportInput } = params;

    // console.log("reportInput", reportInput);
  }

  // perform filtering
  if (datamanager.where) {
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
  if (datamanager.sorted) {
    const condition = datamanager.sorted[0];
    if (condition.direction === "ascending") {
      result.sort((a, b) => a[condition.name] - b[condition.name]);
    } else {
      result.sort((a, b) => b[condition.name] - a[condition.name]);
    }
  }

  return { result, totalRecord };
}

// Resolver
const root = {
  myDataList: getDataList,
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
