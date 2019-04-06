const channels = [
  {
    id: 1,
    name: 'soccer'
  },
  {
    id: 2,
    name: 'baseball'
  }
];

export const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
  },
};
