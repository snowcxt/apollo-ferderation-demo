const { ApolloServer, gql } = require("apollo-server");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const fetch = require("node-fetch");

const port = 4002;
const apiUrl = "http://localhost:3000";

const typeDefs = gql`
  type Mission {
    id: ID!
    crew: [String]
    # crew: [Astronaut]
    designation: String!
    startDate: String
    endDate: String
  }

  # extend type Astronaut @key(fields: "id") {
  #   id: ID! @external
  #   # missions: [Mission]
  # }

  type Query {
    missions: [Mission]
  }
`;

const resolvers = {
  Query: {
    missions() {
      return fetch(`${apiUrl}/missions`).then(res => res.json());
    }
  },
  // Astronaut: {
  //   async missions(astronaut) {
  //     const res = await fetch(`${apiUrl}/missions`);
  //     const missions = await res.json();

  //     return missions.filter(({ crew }) =>
  //       crew.includes(parseInt(astronaut.id))
  //     );
  //   }
  // },
  // Mission: {
  //   crew(mission) {
  //     return mission.crew.map(id => ({ __typename: "Astronaut", id }));
  //   }
  // },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
  console.log(`Missions service ready at ${url}`);
});
