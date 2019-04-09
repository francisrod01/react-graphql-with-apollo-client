const channels = [
  {
    id: 1,
    name: 'soccer',
    messages: [
      {
        id: 1,
        text: 'soccer if football'
      },
      {
        id: 2,
        text: 'hello soccer world cup!'
      }
    ]
  },
  {
    id: 2,
    name: 'baseball',
    messages: [
      {
        id: 3,
        text: 'baseball is life'
      },
      {
        id: 4,
        text: 'hello baseball world series!'
      }
    ]
  }
];

let nextId = 3;

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
      const newChannel = { id: nextId++, messages: [], name: args.name };
      channels.push(newChannel);
      return newChannel;
    },
  },
};
