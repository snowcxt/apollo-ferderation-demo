const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const fetch = require("node-fetch");
const keyBy = require("lodash/keyBy");
const DataLoader = require("dataloader")

const port = 4001;
const apiUrl = "http://localhost:3000";

const typeDefs = gql`
  type Astronaut @key(fields: "id") {
    id: ID!
    name: String
  }

  type Query {
    astronauts: [Astronaut]
  }
`;

const resolvers = {
  // Astronaut: {
  //   __resolveReference(ref, { userLoader }) {
  //     console.log('__resolveReference astronauts', ref)
  //     return userLoader.load(ref.id)
  //   }
  // },
  Query: {
    astronauts() {
      return fetch(`${apiUrl}/astronauts`).then(res => res.json());
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  // context: () => ({
  //   userLoader: new DataLoader(
  //     async ids => {
  //       console.log('Query astronauts DataLoader', ids)
  //       const astronauts = await fetch(`${apiUrl}/astronauts`).then(res => res.json());
  //       const usersById = keyBy(astronauts, "id");
  //       return ids.map(id => usersById[id]);
  //     }
  //   )
  // })
});

server.listen({ port }).then(({ url }) => {
  console.log(`Astronauts service ready at ${url}`);
});
