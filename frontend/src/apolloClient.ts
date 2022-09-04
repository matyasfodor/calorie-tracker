import { InMemoryCache } from "@apollo/client/cache/inmemory/inMemoryCache";
import { ApolloClient } from "@apollo/client/core/ApolloClient";
import { ApolloLink } from "@apollo/client/link/core/ApolloLink";
import { HttpLink } from "@apollo/client/link/http";
import { APOLLO_HOST, LOCAL_STORAGE__AUTH } from "./consts";

const httpLink = new HttpLink({ uri: APOLLO_HOST });

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const token = localStorage.getItem(LOCAL_STORAGE__AUTH);

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink), // Chain it with the HttpLink
  cache: new InMemoryCache({
    typePolicies: {
      Entry: {
        keyFields: ["id"],
      },
      User: {
        keyFields: ["id"],
      }
    }
  }),
});