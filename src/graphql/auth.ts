import { gql } from "graphql-request";

export const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      usuario {
        id
        nome
        email
        perfil
      }
    }
  }
`;
