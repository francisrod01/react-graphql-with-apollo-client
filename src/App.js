import React, { Component } from 'react';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import {
  graphql,
  ApolloProvider
} from 'react-apollo';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema
} from 'graphql-tools';
import { SchemaLink } from 'apollo-link-schema';

import { typeDefs } from './schema';

import logo from './logo.svg';
import './App.css';


const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ schema });

const apolloClient = new ApolloClient({
  link: new SchemaLink({ schema }),
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

const ChannelsList = ({ data: { loading, error, channels } }) => {
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <ul className="Item-list">
      {
        channels.map(ch => <li key={ch.id}>{ch.name}</li>)
      }
    </ul>
  );
}

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
