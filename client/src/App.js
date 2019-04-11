import React, { Component } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Switch
} from "react-router-dom";

import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
} from 'apollo-boost';
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from 'apollo-utilities';
import {
  ApolloProvider,
  toIdvalue
} from 'react-apollo';

import ChannelsListWithData from "./components/ChannelsListWithData";
import ChannelDetails from "./components/ChannelDetails";
import NotFound from "./components/NotFound";

import './App.css';

// Tag GraphQL objects in the cache.
const dataIdFromObject = result => {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}

// Create an http link
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

// Create a WebSocket link
const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/subscriptions",
  options: {
    reconnect: true
  }
});

// Using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent.
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  customResolvers: {
    Query: {
      channel: (_, args) => {
        // Ensures an ID type is returned.
        return toIdvalue(dataIdFromObject({ __typename: "Channel", id: args["id"] }));
      },
    },
  },
  dataIdFromObject,
});


class App extends Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <div className="App">
            <Link to="/" className="navbar">React + GraphQL tutorial</Link>

            <Switch>
              <Route exact path="/" component={ChannelsListWithData} />
              <Route exact path="/channel/:channelId" component={ChannelDetails} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
