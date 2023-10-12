import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import FruitModel from "./models/fruit";
import { connectToDB } from "./connectToDb";

const typeDefs = gql`
  type Fruit {
    id: ID
    fruit_name: String
  }

  type Query {
    fruits: [Fruit]
  }

  type Mutation {
    addFruit(fruit_name: String!): Fruit
  }
`;

const resolvers = {
  Query: {
    fruits: async () => {
      console.log("Query get all fruits:");
      // Retrieve fruits from the database
      return await FruitModel.find();
    },
  },
  Mutation: {
    addFruit: (parent: unknown, args: { fruit_name: string }) => {
      console.log("Received fruit_name:", args.fruit_name);
      try {
        if (!args.fruit_name) {
          throw new Error("Fruit name cannot be empty.");
        }

        const fruit = new FruitModel({ fruit_name: args.fruit_name });
        fruit.save();
        console.log("Fruit saved:", fruit);
        return { fruit_name: fruit.fruit_name, id: fruit.id }; // Return fruit_name along with id
      } catch (error) {
        console.error("Error saving fruit:", error);
        throw error;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

// Connect to MongoDB
connectToDB();

async function startServer() {
  await server.start(); // Start the Apollo Server
  server.applyMiddleware({ app }); // Apply middleware after starting
}

startServer().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `Server is running on http://localhost:${PORT}${server.graphqlPath}`
    );
  });
});
