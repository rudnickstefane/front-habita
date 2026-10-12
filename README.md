# Habita - Front-end

Interface web do sistema de gestão imobiliária Habita.

**(Entrega: 13/10) - AC 2: Cadastro de proprietários**

## Descrição

O front-end é o ponto de contato com o Habita. Nesta AC 2, administrador e corretor cadastram proprietários. O menu de corretores continua exclusivo do administrador.

## Tecnologias

- React
- TypeScript
- Vite
- pnpm
- Material UI
- GraphQL (`graphql-request`)

## Telas

| Rota              | Valor                                                          |
| ----------------- | -------------------------------------------------------------- |
| `/login`          | Entrada no sistema com e-mail e senha; grava o JWT             |
| `/`               | Dashboard com atalho para proprietários (e corretores no admin) |
| `/proprietarios`  | Formulário e tabela — **administrador e corretor**             |
| `/corretores`     | Formulário e tabela — **somente o administrador**              |

O menu do administrador tem **Dashboard**, **Proprietários** e **Corretores**. O menu do corretor tem **Dashboard** e **Proprietários**.

## Próximas telas

| Entrega       | Tela    | Valor               |
| ------------- | ------- | ------------------- |
| AC 3 (08/11)  | Imóveis | Catálogo de imóveis |
| Final (22/11) | Visitas | Agenda de visitas   |

## Como rodar

```bash
pnpm install
pnpm start:dev
```

Acesse `http://localhost:5173`. O front consome `http://localhost:3000/graphql`.
