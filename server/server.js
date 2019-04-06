import express from "express";
import { graphqlExpress } from "graphql-server-express";
import bodyParser from "body-parser";

import { schema } from "./schema";

const PORT = process.env.PORT || 4000;
const server = express();

server.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

server.listen(PORT, () => console.log(`Express Server is running on http://localhost:${PORT}`));
