# Habita - Front-end

Interface web do sistema de gestão imobiliária Habita.

**(Entrega: 08/11) - AC 3: Cadastro de imóveis**

## Descrição

O front-end é o ponto de contato com o Habita. Nesta AC 3, o catálogo de imóveis é cadastrado com proprietário, endereço, valor e no mínimo 2 fotos. O proprietário entra no portal e solicita o cadastro, que fica pendente até o corretor ou o administrador aprovar.

## Tecnologias

- React
- TypeScript
- Vite
- pnpm
- Material UI
- GraphQL (`graphql-request`)

## Telas

| Rota             | Valor                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| `/login`         | Entrada de administrador, corretor ou proprietário; grava o JWT       |
| `/`              | Dashboard com atalhos conforme o perfil                               |
| `/imoveis`       | Formulário com dropzone, tabela e aprovação                           |
| `/proprietarios` | Formulário (com senha de portal) e tabela — **admin e corretor**      |
| `/corretores`    | Formulário e tabela — **somente o administrador**                     |

O menu do administrador tem **Dashboard**, **Imóveis**, **Proprietários** e **Corretores**. O menu do corretor tem **Dashboard**, **Imóveis** e **Proprietários**. O menu do proprietário tem **Dashboard** e **Imóveis**.

## Próximas telas

| Entrega       | Tela    | Valor             |
| ------------- | ------- | ----------------- |
| Final (22/11) | Visitas | Agenda de visitas |

## Como rodar

```bash
pnpm install
pnpm start:dev
```

Acesse `http://localhost:5173`. O front consome `http://localhost:3000/graphql` e envia fotos para `http://localhost:3000/uploads/fotos`.
