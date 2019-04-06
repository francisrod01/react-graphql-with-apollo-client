import React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

const AddChannel = ({ mutate }) => {
  const handleKeyUp = evt => {
    // If ENTER key has been pressed, then proceed.
    if (evt.keyCode === 13) {
      evt.persist();

      mutate({
        variables: { name: evt.target.value }
      })
      .then(res => {
        evt.target.value = "";
      });
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
