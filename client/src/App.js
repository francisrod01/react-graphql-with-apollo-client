import React, { Component } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink
} from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import ChannelsListWithData from "./components/ChannelsListWithData";

import logo from './logo.svg';
import './App.css';

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
  cache: new InMemoryCache()
});


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
