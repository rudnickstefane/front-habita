import { gql } from "graphql-request";

export const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      corretor {
        id
        nome
        email
      }
    }
  }
`;
