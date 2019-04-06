import express from "express";
import cors from "cors";
import {
  graphqlExpress,
  graphiqlExpress
} from "graphql-server-express";
import bodyParser from "body-parser";

import { schema } from "./schema";

const PORT = process.env.PORT || 4000;
const server = express();

// Allow cross-origin request from the front-end origin.
server.use("*", cors({ origin: "http://localhost:3000" }));

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

server.listen(PORT, () => console.log(`Express Server is running on http://localhost:${PORT}`));
