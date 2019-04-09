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

export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (root, { id }) => {
      return channels.find(channel => channel.id === id);
    },
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
      return newMessage;
    },
  },
};
