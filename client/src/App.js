import React, { Component } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from 'apollo-boost';
import gql from 'graphql-tag';
import {
  graphql,
  ApolloProvider
} from 'react-apollo';

import ChannelsList from "./components/ChannelsList";

import logo from './logo.svg';
import './App.css';

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  cache: new InMemoryCache()
});

const channelsListQuery = gql`
  query ChannelsListQuery {
    channels {
      id
      name
    }
  }
`;

const ChannelsListWithData = graphql(channelsListQuery)(ChannelsList);


class App extends Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to Apollo!</h2>

            <ChannelsListWithData />

            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
