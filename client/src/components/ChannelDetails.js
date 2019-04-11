import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import ChannelPreview from "./ChannelPreview";
import MessageList from "./MessageList";
import NotFound from "./NotFound";

class ChannelDetails extends Component {
  componentWillMount() {
    this.props.data.subscribeToMore({
      document: messagesSubscription,
      variables: {
        channelId: this.props.match.params.channelId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        const newMessage = subscriptionData.data.messageAdded;

        // Don't double add the message
        if (!prev.channel.messageFeed.messages.find(msg => msg.id === newMessage.id)) {
          return Object.assign({}, prev, {
            channel: Object.assign({}, prev.channel, {
              messageFeed: {
                messages: [...prev.channel.messageFeed.messages, newMessage],
              }
            })
          });
        }
        else {
          return prev;
        }
      }
    });
  }
  render() {
    const { data: { loading, error, channel }, match, loadOlderMessages } = this.props;

    if (loading) {
      return <ChannelPreview channelId={match.params.channelId} />;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    if (channel === null) {
      return <NotFound />
    }

    return (
      <div>
        <div className="channelName">
          {channel.name}
        </div>

        <button onClick={loadOlderMessages}>
          Load Older Messages
        </button>

        <MessageList messages={channel.messageFeed.messages} />
      </div>
    );
  }
}

export const channelDetailsQuery = gql`
  query ChannelDetailsQuery($channelId: ID!, $cursor: String) {
    channel(id: $channelId) {
      id
      name
      messageFeed(cursor: $cursor) @connection(key: "messageFeed") {
        cursor
        messages {
          id
          text
        }
      }
    }
  }
`;

const messagesSubscription = gql`
  subscription messageAdded($channelId: ID!) {
    messageAdded(channelId: $channelId) {
      id
      text
    }
  }
`;

export default (graphql(channelDetailsQuery, {
  options: props => ({
    variables: { channelId: props.match.params.channelId },
  }),
  props: props => ({
    data: props.data,
    loadOlderMessages: () => {
      return props.data.fetchMore({
        variables: {
          channelId: props.data.channel.id,
          cursor: props.data.channel.messageFeed.cursor,
        },
        updateQuery(previousResult, { fetchMoreResult }) {
          const prevMessageFeed = previousResult.channel.messageFeed;
          const newMessageFeed = fetchMoreResult.channel.messageFeed;

          const newChannelData = {
            ...previousResult.channel,
            messageFeed: {
              messages: [
                ...prevMessageFeed.messages,
                ...newMessageFeed.messages,
              ],
            },
          };

          const newData = {
            ...previousResult,
            channel: newChannelData,
          };

          return newData;
        }
      })
    }
  }),
})(ChannelDetails));
