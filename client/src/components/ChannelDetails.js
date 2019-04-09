import React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

const ChannelDetails = ({ data: { loading, error, channel }}, match) => {
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <div className="channelName">
        {channel.name}
      </div>
    </div>
  );
}

export const channelDetailsQuery = gql`
  query ChannelDetailsQuery($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
    }
  }
`;

export default (graphql(channelDetailsQuery, {
  options: props => ({
    variables: { channelId: props.match.params.channelId },
  }),
})(ChannelDetails));
