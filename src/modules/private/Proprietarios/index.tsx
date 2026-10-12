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
  CRIAR_PROPRIETARIO_MUTATION,
  PROPRIETARIOS_QUERY,
} from "@sr/graphql/proprietarios";
import { useBackend } from "@sr/modules/common/hooks/useBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClientError } from "graphql-request";
import { FormEvent, useState } from "react";

type Proprietario = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  createdAt: string;
};

type ProprietariosResponse = {
  proprietarios: Proprietario[];
};

type CriarProprietarioResponse = {
  criarProprietario: Proprietario;
};

function getErrorMessage(error: unknown) {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message || "Falha na requisição GraphQL.";
  }

  return "Não foi possível concluir a operação.";
}

function formatDocumento(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function formatTelefone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  }

  return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export default function Proprietarios() {
  const backend = useBackend();
  const queryClient = useQueryClient();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [documento, setDocumento] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const proprietariosQuery = useQuery({
    queryKey: ["proprietarios"],
    queryFn: () => backend.request<ProprietariosResponse>(PROPRIETARIOS_QUERY),
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      nome: string;
      email: string;
      telefone: string;
      documento: string;
    }) =>
      backend.request<CriarProprietarioResponse>(CRIAR_PROPRIETARIO_MUTATION, {
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proprietarios"] });
      setNome("");
      setEmail("");
      setTelefone("");
      setDocumento("");
      setFormError("");
      setFormSuccess("Proprietário cadastrado com sucesso.");
    },
    onError: (error) => {
      setFormSuccess("");
      setFormError(getErrorMessage(error));
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createMutation.mutate({ nome, email, telefone, documento });
  }

  const proprietarios = proprietariosQuery.data?.proprietarios ?? [];

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Proprietários
        </Typography>
        <Typography color="text.secondary">
          Cadastre os donos dos imóveis. Disponível para administrador e corretor.
        </Typography>
      </Box>

      <Paper className="p-6 border border-[#e4d9cc]" elevation={0}>
        <Typography variant="h6" fontWeight={600} className="mb-4">
          Novo proprietário
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2"
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
            label="Telefone"
            value={telefone}
            onChange={(event) => setTelefone(formatTelefone(event.target.value))}
            placeholder="(11) 99999-9999"
            required
          />
          <TextField
            label="Documento"
            value={documento}
            onChange={(event) => setDocumento(formatDocumento(event.target.value))}
            placeholder="CPF ou CNPJ"
            required
          />
          <Box className="md:col-span-2 flex items-center gap-3">
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
          Proprietários cadastrados
        </Typography>

        {proprietariosQuery.isLoading && (
          <Box className="flex justify-center py-8">
            <CircularProgress />
          </Box>
        )}

        {proprietariosQuery.isError && (
          <Alert severity="error">{getErrorMessage(proprietariosQuery.error)}</Alert>
        )}

        {!proprietariosQuery.isLoading && !proprietariosQuery.isError && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Cadastro</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proprietarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>Nenhum proprietário cadastrado.</TableCell>
                </TableRow>
              ) : (
                proprietarios.map((proprietario) => (
                  <TableRow key={proprietario.id}>
                    <TableCell>{proprietario.nome}</TableCell>
                    <TableCell>{proprietario.email}</TableCell>
                    <TableCell>{formatTelefone(proprietario.telefone)}</TableCell>
                    <TableCell>{formatDocumento(proprietario.documento)}</TableCell>
                    <TableCell>
                      {new Date(proprietario.createdAt).toLocaleDateString("pt-BR")}
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
