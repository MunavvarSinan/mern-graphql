import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query {
    allProjects {
      id
      name
      status
    }
  }
`;