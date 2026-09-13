import { gql } from "graphql-request";

export const CORRETORES_QUERY = gql`
  query Corretores {
    corretores {
      id
      nome
      email
      perfil
      createdAt
    }
  }
`;

export const CRIAR_CORRETOR_MUTATION = gql`
  mutation CriarCorretor($data: CreateCorretorInput!) {
    criarCorretor(data: $data) {
      id
      nome
      email
      perfil
      createdAt
    }
  }
`;
