import React from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import AddChannel from "./AddChannel";

export const ChannelsList = ({ data: { loading, error, channels } }) => {
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="channelsList">
      <AddChannel />

      {
        channels.map(ch => (
          <div
            key={ch.id}
            className={"channel " + (ch.id < 0 ? "optimistic" : "")}
          >
            <Link to={ch.id < 0 ? "/" : `/channel/${ch.id}`}>{ch.name}</Link>
          </div>
        ))
      }
    </div>
  );
}

export const channelsListQuery = gql`
  query ChannelsListQuery {
    channels {
      id
      name
    }
  }
`;

export default graphql(channelsListQuery, {
  options: { pollInterval: 5000 }, // Apollo will return the query every 5 seconds
})(ChannelsList);
