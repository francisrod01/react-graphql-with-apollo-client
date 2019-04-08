import React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import { channelsListQuery } from "./ChannelsListWithData";

const AddChannel = ({ mutate }) => {
  const handleKeyUp = evt => {
    // If ENTER key has been pressed, then proceed.
    if (evt.keyCode === 13) {
      mutate({
        variables: { name: evt.target.value },
        optimisticResponse: {
          addChannel: {
            __typename: "Channel",
            id: Math.round(Math.random() * -1000000),
            name: evt.target.value,
          },
        },
        update: (store, { data: { addChannel } }) => {
          // Read the data from the cache for this query.
          const data = store.readQuery({ query: channelsListQuery });

          // Add our channel from the mutation to the end.
          data.channels.push(addChannel);

          // Write the data back to the cache.
          store.writeQuery({ query: channelsListQuery, data });
        },
      });

      evt.target.value = "";
    }
  };

  return (
    <input
      type="text"
      placeholder="New channel"
      onKeyUp={handleKeyUp}
    />
  );
};

const addChannelMutation = gql`
  mutation addChannel($name: String!) {
    addChannel(name: $name) {
      id
      name
    }
  }
`;

const AddChannelWithMutation = graphql(
  addChannelMutation
)(AddChannel);

export default AddChannelWithMutation;
