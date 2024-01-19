var express = require("express")
var { graphqlHTTP } = require("express-graphql")
var {   GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
   } = require("graphql")
const data = require('./data.json');
const cors = require('cors');
// const _ = require('lodash');
const app = express();

// allow cross-origin requests
app.use(cors());

const MyDataType = new GraphQLObjectType({
  name: 'MyData',
  fields: ( ) => ({
      areaId: { type: GraphQLString },
      geoCode: { type: GraphQLString },
      geoName: { type: GraphQLString },
      count: { type: GraphQLFloat },
      percentComp: { type: GraphQLFloat },
      percentPen: { type: GraphQLFloat },
      index: { type: GraphQLInt },
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
      myDataList: {
          type: new GraphQLList(MyDataType),
          resolve(parent, args){
            return data; // need to return an array
          }
      },
  }
});

var schema = new GraphQLSchema({
  query: RootQuery,
});

// bind express with graphql
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
)
app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")