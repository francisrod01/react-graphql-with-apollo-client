import { PubSub, withFilter } from "graphql-subscriptions";
import faker from "faker";

const channels = [];
let lastChannelId = 0;
let lastMessageId = 0;
let messageCreatedAt = 123456789;


// Adding a fake channel.
const addChannel = name => {
  lastChannelId++;

  const newChannel = {
    id: String(lastChannelId),
    name,
    messages: [],
  };

  channels.push(newChannel);

  return lastChannelId;
}

// Getting a channel by id.
const getChannel = id =>
  channels.find(channel => channel.id === id);

// Adding a fake message to a channel.
const addFakeMessage = (channel, messageText) => {
  lastMessageId++;
  messageCreatedAt++;

  const newMessage = {
    id: lastMessageId,
    text: messageText,
    createdAt: messageCreatedAt,
  };

  channel.messages.push(newMessage);
}

// Use faker to generate random messages in faker channel.
addChannel("faker");
const fakerChannel = channels.find(channel => channel.name === "faker");

// Add seed for consistent random data.
faker.seed(9);
for (let i = 0; i < 50; i++) {
  addFakeMessage(fakerChannel, faker.random.words());
}

// Generate second channel for initial channel list view.
addChannel("channel2");

// An instance to handle the subscription topics for our application.
const pubsub = new PubSub();

export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (root, { id }) => {
      return getChannel(id);
    },
  },
  // The new resolvers are under the Channel type
  Channel: {
    messageFeed: (channel, { cursor }) => {
      // The cursor passed by the client will be an integer timestamp.
      // If no cursor is passed, set the cursor to the time the last
      // channel message was created.
      if (!cursor) {
        cursor = channel.messages[channel.messages.length - 1].createdAt;
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
      const name = args.name;
      const id = addChannel(name);
      return getChannel(id);
    },
    addMessage: (root, { message }) => {
      const channel = channels.find(channel => channel.id === message.channelId);
      if (!channel) {
        throw new Error("Channel does not exist!");
      }

      const newMessage = {
        id: String(lastMessageId++),
        text: message.text,
        createdAt: +new Date(),
      };
      channel.messages.push(newMessage);

      // Publishing the message into the subscription manager.
      pubsub.publish("messageAdded", {
        messageAdded: newMessage,
        channelId: message.channelId
      });

      return newMessage;
    },
  },
  // GraphQL subscription query.
  Subscription: {
    messageAdded: {
      subscribe: withFilter(() =>
        pubsub.asyncIterator("messageAdded"),
        (payload, variables) => {
          // The `messageAdded` channel includes events for all channels, so we filter
          // to only pass through events for the channel specified in the query.
          return payload.channelId === variables.channelId;
        },
      )
    },
  },
};
