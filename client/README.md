# React GraphQL data query using Apollo client #

This is the front-end that is part of the [react-graphql-with-apollo-client](../../../) project.

Author: [Francis Rodrigues][1]

## Dependencies version

* ![react-logo](../screenshots/react-24.png) React libs
  * `react@^16.8.2`
  * `react-dom@^16.8.2`
  * `react-scripts@^2.1.8`
* ![apollo-logo](../screenshots/apollo-24.png) Apollo libs
  * `react-apollo@^2.4.1`
  * `apollo-boost@^0.1.28`
  * `apollo-link-schema@^1.1.6`
* ![graphql-logo](../screenshots/graphql-24.png) GraphQL libs
  * `graphql@^14.1.1`
  * `graphql-tag@^2.10.1`
  * `graphql-tools@^4.0.4`

## Starting the front-end application

First, you need to install npm dependencies:

```bash
~$ npm install
```

and then start the service:

```bash
~$ npm start

> react-graphql-with-apollo@0.1.0 start /home/paneladm/projects/react-graphql-with-apollo/client
> react-scripts start

Starting the development server...

Compiled successfully!

You can now view react-graphql-with-apollo in the browser.

  Local:            http://localhost:3000/
  On Your Network:  http://192.168.0.100:3000/

Note that the development build is not optimized.
To create a production build, use npm run build.
```

Now you can access the link http://localhost:3000 and see the application running successfully. :ok_hand:

## References

* [Apollo Client DevTools][2] - Apollo DevTools extension for Chrome & Firefox

## License

MIT

  [1]: https://github.com/francisrod01
  [2]: https://github.com/apollographql/apollo-client-devtools
