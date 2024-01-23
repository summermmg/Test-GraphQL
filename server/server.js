var express = require("express");
var { graphqlHTTP } = require("express-graphql");
const data = require("./data.json");
var { buildSchema } = require("graphql");
const cors = require("cors");
const app = express();

// allow cross-origin requests
app.use(cors());

// GraphQL Schema
const schema = buildSchema(`
      type Query {
        myDataList(datamanager: Datamanager): [MyData]
      }
      type MyData {
        areaId: String
        order: Int
        geoCode: String
        geoName: String
        count: Float
        index: Int
      }

      input Datamanager {
        params: String
        sorted: [Sorted]
        skip: Int
        take: Int
        where: String
      }

      input Sorted {
        name: String
        direction: String
      }
`);

// Get data list
function getDataList({ datamanager }) {
  let result = [...data];

  if (datamanager.params) {
    // fetch data by report input
    const params = JSON.parse(datamanager.params);
    const { reportInput } = params;

    console.log("reportInput", reportInput);
  }

  // perform filtering
  if (datamanager.where) {
    console.log(datamanager.where);
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

  return result;
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
