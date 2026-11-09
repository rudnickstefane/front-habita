import { gql } from "graphql-request";

export const IMOVEIS_QUERY = gql`
  query Imoveis {
    imoveis {
      id
      tipo
      endereco
      valor
      status
      fotos
      proprietarioId
      createdAt
      proprietario {
        id
        nome
        email
      }
    }
  }
`;

export const CRIAR_IMOVEL_MUTATION = gql`
  mutation CriarImovel($data: CreateImovelInput!) {
    criarImovel(data: $data) {
      id
      tipo
      endereco
      valor
      status
      fotos
      proprietario {
        id
        nome
      }
    }
  }
`;

export const APROVAR_IMOVEL_MUTATION = gql`
  mutation AprovarImovel($id: Int!) {
    aprovarImovel(id: $id) {
      id
      status
    }
  }
`;

export const RECUSAR_IMOVEL_MUTATION = gql`
  mutation RecusarImovel($id: Int!) {
    recusarImovel(id: $id) {
      id
      status
    }
  }
`;
