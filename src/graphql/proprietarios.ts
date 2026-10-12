import { gql } from "graphql-request";

export const PROPRIETARIOS_QUERY = gql`
  query Proprietarios {
    proprietarios {
      id
      nome
      email
      telefone
      documento
      createdAt
    }
  }
`;

export const CRIAR_PROPRIETARIO_MUTATION = gql`
  mutation CriarProprietario($data: CreateProprietarioInput!) {
    criarProprietario(data: $data) {
      id
      nome
      email
      telefone
      documento
      createdAt
    }
  }
`;
