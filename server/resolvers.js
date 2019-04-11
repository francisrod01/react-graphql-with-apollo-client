import { PubSub, withFilter } from "graphql-subscriptions";

const channels = [
  {
    id: "1",
    name: 'soccer',
    messages: [
      {
        id: "1",
        text: 'soccer if football'
      },
      {
        id: "2",
        text: 'hello soccer world cup!'
      }
    ]
  },
  {
    id: "2",
    name: 'baseball',
    messages: [
      {
        id: "3",
        text: 'baseball is life'
      },
      {
        id: "4",
        text: 'hello baseball world series!'
      }
    ]
  }
];

let nextId = 3;
let newMessageId = 5;

// An instance to handle the subscription topics for our application.
const pubsub = new PubSub();

export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (root, { id }) => {
      return channels.find(channel => channel.id === id);
    },
  },
  // The new resolvers are under the Channel type
  Channel: {
    messageFeed: (channel, { cursor }) => {
      // The cursor passed by the client will be an integer timestamp.
      // If no cursor is passed, set the cursor to the time the last
      // channel message was created.
      if (!cursor) {
        cursor = channel.messages[channel.messages.lenght - 1].createdAt;
      }

      cursor = parseInt(cursor);

      // Limit is the number of messages we will return.
      // We could pass it as an argument but in this case let's use a
      // static value.
      const limit = 10;

      // Find the message index created at time held on the cursor
      const newestMessageIndex = channel.messages.findIndex(
        message => message.createdAt === cursor
      );

      // We need to return a new cursor to the client so that it can find
      // the next page. Let's set newCursor to the createdAt time of the
      // last message in the messageFeed.
      const newCursor = channel.messages[newestMessageIndex - limit].createdAt;

      const messageFeed = {
        messages: channel.messages.slice(
          newestMessageIndex - limit,
          newestMessageIndex
        ),
        cursor: newCursor,
      };

      return messageFeed;
    }
  },
  Mutation: {
    addChannel: (root, args) => {
      const newChannel = { id: String(nextId++), messages: [], name: args.name };
      channels.push(newChannel);
      return newChannel;
    },
    addMessage: (root, { message }) => {
      const channel = channels.find(channel => channel.id === message.channelId);
      if (!channel) {
        throw new Error("Channel does not exist!");
      }

      const newMessage = { id: String(newMessageId++), text: message.text };
      channel.messages.push(newMessage);

      // Publishing the message into the subscription manager.
      pubsub.publish("messageAdded", { messageAdded: newMessage, channelId: message.channelId });

      return newMessage;
    },
  },
  // GraphQL subscription query.
  Subscription: {
    messageAdded: {
      subscribe: withFilter(() =>
        pubsub.asyncIterator("messageAdded"),
        (payload, variables) => {
          return payload.channelId === variables.channelId;
        },
      )
    },
  },
};
