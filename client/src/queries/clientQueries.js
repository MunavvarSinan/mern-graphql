import { gql } from '@apollo/client';

export const GET_CLIENTS = gql`
  query {
    allClients {
      id
      name
      email
      phone
    }
  }
`;
