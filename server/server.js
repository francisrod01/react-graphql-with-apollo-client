import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { createServer } from "http";
import { execute, subscribe } from "graphql";
import {
  graphqlExpress,
  graphiqlExpress
} from "graphql-server-express";
import { SubscriptionServer } from "subscriptions-transport-ws";

import { schema } from "./schema";

const PORT = process.env.PORT || 4000;
const server = express();

// Allow cross-origin request from the front-end origin.
server.use("*", cors({ origin: "http://localhost:3000" }));

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:4000/subscriptions'
}));

// Wrap the Express server
const ws = createServer(server);

ws.listen(PORT, () => {
  console.log(`GraphQL Server is running on http://localhost:${PORT}`);

  // Set up the WebSocket for handling GraphQL subscriptions.
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: "/subscriptions",
  });
});
