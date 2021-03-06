import { makeExecutableSchema } from "graphql-tools";

import { resolvers } from "./resolvers";

const typeDefs = `
  type Channel {
    id: ID!   ## "!" denotes a required field
    name: String,
    messages: [Message]
    # Messages will be returned in a MessageFeed object wrapper
    messageFeed(cursor: String): MessageFeed
  }

  type Message {
    id: ID!
    text: String
    createdAt: Int
  }

  type MessageFeed {
    # Cursor specifies the place in the list where we left off
    cursor: String!
    # this is a chunk of messages to be returned
    messages: [Message]!
  }

  # This types specifies the entry points into our API. In this case
  # there is only one - "channels" - which returns a list of channels
  type Query {
    channels: [Channel]   ## "[]" means this is a list of channels
    channel(id: ID!): Channel
  }

  input MessageInput {
    channelId: ID!
    text: String
  }

  # The mutation root type, used to define all mutations.
  type Mutation {
    # A mutation to add a new channel to the list of channels
    addChannel(name: String!): Channel
    addMessage(message: MessageInput!): Message
  }

  type Subscription {
    messageAdded(channelId: ID!): Message
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
