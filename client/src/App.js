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
  HttpLink
} from 'apollo-boost';
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

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
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
