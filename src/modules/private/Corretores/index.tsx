import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  CORRETORES_QUERY,
  CRIAR_CORRETOR_MUTATION,
} from "@sr/graphql/corretores";
import { useBackend } from "@sr/modules/common/hooks/useBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClientError } from "graphql-request";
import { FormEvent, useState } from "react";

type Corretor = {
  id: number;
  nome: string;
  email: string;
  createdAt: string;
};

type CorretoresResponse = {
  corretores: Corretor[];
};

type CriarCorretorResponse = {
  criarCorretor: Corretor;
};

function getErrorMessage(error: unknown) {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message || "Falha na requisição GraphQL.";
  }

  return "Não foi possível concluir a operação.";
}

export default function Corretores() {
  const backend = useBackend();
  const queryClient = useQueryClient();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const corretoresQuery = useQuery({
    queryKey: ["corretores"],
    queryFn: () => backend.request<CorretoresResponse>(CORRETORES_QUERY),
  });

  const createMutation = useMutation({
    mutationFn: (data: { nome: string; email: string; senha: string }) =>
      backend.request<CriarCorretorResponse>(CRIAR_CORRETOR_MUTATION, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corretores"] });
      setNome("");
      setEmail("");
      setSenha("");
      setFormError("");
      setFormSuccess("Corretor cadastrado com sucesso.");
    },
    onError: (error) => {
      setFormSuccess("");
      setFormError(getErrorMessage(error));
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createMutation.mutate({ nome, email, senha });
  }

  const corretores = corretoresQuery.data?.corretores ?? [];

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Corretores
        </Typography>
        <Typography color="text.secondary">
          Cadastre um novo corretor e acompanhe a lista atual.
        </Typography>
      </Box>

      <Paper className="p-6 border border-[#e4d9cc]" elevation={0}>
        <Typography variant="h6" fontWeight={600} className="mb-4">
          Novo corretor
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-3"
        >
          <TextField
            label="Nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
          />
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />
          <Box className="md:col-span-3 flex items-center gap-3">
            <Button
              type="submit"
              variant="contained"
              className="btn-primary"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Cadastrar"
              )}
            </Button>
            {formError && <Alert severity="error">{formError}</Alert>}
            {formSuccess && <Alert severity="success">{formSuccess}</Alert>}
          </Box>
        </Box>
      </Paper>

      <Paper className="p-6 border border-[#e4d9cc]" elevation={0}>
        <Typography variant="h6" fontWeight={600} className="mb-4">
          Corretores cadastrados
        </Typography>

        {corretoresQuery.isLoading && (
          <Box className="flex justify-center py-8">
            <CircularProgress />
          </Box>
        )}

        {corretoresQuery.isError && (
          <Alert severity="error">{getErrorMessage(corretoresQuery.error)}</Alert>
        )}

        {!corretoresQuery.isLoading && !corretoresQuery.isError && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Cadastro</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {corretores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>Nenhum corretor cadastrado.</TableCell>
                </TableRow>
              ) : (
                corretores.map((corretor) => (
                  <TableRow key={corretor.id}>
                    <TableCell>{corretor.nome}</TableCell>
                    <TableCell>{corretor.email}</TableCell>
                    <TableCell>
                      {new Date(corretor.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
