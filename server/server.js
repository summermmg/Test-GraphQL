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
        count: Float
        index: Int
      }

      input Datamanager {
        sorted: [Sorted]
        skip: Int
        take: Int
      }

      input Sorted {
        name: String
        direction: String
      }
`);

//Get data list by order
function getDataList(args) {
console.log(args.datamanager)
return data
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
