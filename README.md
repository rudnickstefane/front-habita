# Habita - Front-end

Interface web do sistema de gestão imobiliária Habita.

**(Entrega: 14/09) - AC 1: Tela de login e cadastro de corretores**

## Descrição

O front-end é o ponto de contato com o Habita. Nesta AC 1 o administrador cadastra a equipe comercial. O corretor entra no sistema e vê a mensagem de em breve da AC 2.

## Tecnologias

- React
- TypeScript
- Vite
- pnpm
- Material UI
- GraphQL (`graphql-request`)

## Telas da AC 1

| Rota          | Valor                                                                       |
| ------------- | --------------------------------------------------------------------------- |
| `/login`      | Entrada no sistema com e-mail e senha; grava o JWT                          |
| `/`           | Dashboard. Admin vê o atalho de corretores; o corretor vê “Em breve — AC 2” |
| `/corretores` | Formulário e tabela — **somente o administrador**                           |

O menu do administrador tem **Dashboard** e **Corretores**. O menu do corretor tem só **Dashboard**.

## Próximas telas

| Entrega       | Tela          | Valor                                          |
| ------------- | ------------- | ---------------------------------------------- |
| AC 2 (13/10)  | Proprietários | Cadastro e listagem - administrador e corretor |
| AC 3 (08/11)  | Imóveis       | Catálogo de imóveis                            |
| Final (22/11) | Visitas       | Agenda de visitas                              |

## Como rodar

```bash
pnpm install
pnpm start:dev
```

Acesse `http://localhost:5173`. O front consome `http://localhost:3000/graphql`.
