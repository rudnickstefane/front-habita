import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { photoUrl, uploadFotos } from "@sr/common/api";
import {
  APROVAR_IMOVEL_MUTATION,
  CRIAR_IMOVEL_MUTATION,
  IMOVEIS_QUERY,
  RECUSAR_IMOVEL_MUTATION,
} from "@sr/graphql/imoveis";
import { PROPRIETARIOS_QUERY } from "@sr/graphql/proprietarios";
import PhotosDropzone from "@sr/modules/common/PhotosDropzone";
import { useBackend } from "@sr/modules/common/hooks/useBackend";
import { useAuthStore } from "@sr/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClientError } from "graphql-request";
import { FormEvent, useState } from "react";

type TipoImovel = "CASA" | "APARTAMENTO" | "TERRENO" | "COMERCIAL";
type StatusImovel = "PENDENTE" | "APROVADO" | "RECUSADO";

type Imovel = {
  id: number;
  tipo: TipoImovel;
  endereco: string;
  valor: number;
  status: StatusImovel;
  fotos: string[];
  createdAt: string;
  proprietario: {
    id: number;
    nome: string;
    email: string;
  };
};

type ProprietarioOption = {
  id: number;
  nome: string;
  email: string;
};

const TIPOS: { value: TipoImovel; label: string }[] = [
  { value: "CASA", label: "Casa" },
  { value: "APARTAMENTO", label: "Apartamento" },
  { value: "TERRENO", label: "Terreno" },
  { value: "COMERCIAL", label: "Comercial" },
];

function getErrorMessage(error: unknown) {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message || "Falha na requisição GraphQL.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function tipoLabel(tipo: TipoImovel) {
  return TIPOS.find((item) => item.value === tipo)?.label ?? tipo;
}

function statusChip(status: StatusImovel) {
  if (status === "APROVADO") {
    return <Chip size="small" label="Aprovado" color="success" />;
  }

  if (status === "RECUSADO") {
    return <Chip size="small" label="Recusado" color="error" />;
  }

  return <Chip size="small" label="Pendente" color="warning" />;
}

export default function Imoveis() {
  const backend = useBackend();
  const queryClient = useQueryClient();
  const { token, usuario } = useAuthStore();
  const isStaff = usuario?.perfil === "ADMIN" || usuario?.perfil === "CORRETOR";

  const [tipo, setTipo] = useState<TipoImovel>("CASA");
  const [endereco, setEndereco] = useState("");
  const [valor, setValor] = useState("");
  const [proprietarioId, setProprietarioId] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const imoveisQuery = useQuery({
    queryKey: ["imoveis"],
    queryFn: () => backend.request<{ imoveis: Imovel[] }>(IMOVEIS_QUERY),
  });

  const proprietariosQuery = useQuery({
    queryKey: ["proprietarios"],
    queryFn: () =>
      backend.request<{ proprietarios: ProprietarioOption[] }>(PROPRIETARIOS_QUERY),
    enabled: isStaff,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (fotos.length < 2) {
        throw new Error("Envie no mínimo 2 fotos do imóvel.");
      }

      if (!token) {
        throw new Error("Sessão expirada. Entre novamente.");
      }

      const urls = await uploadFotos(fotos, token);
      return backend.request<{ criarImovel: Imovel }>(CRIAR_IMOVEL_MUTATION, {
        data: {
          tipo,
          endereco,
          valor: Number(valor.replace(",", ".")),
          fotos: urls,
          ...(isStaff ? { proprietarioId: Number(proprietarioId) } : {}),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imoveis"] });
      setEndereco("");
      setValor("");
      setProprietarioId("");
      setFotos([]);
      setFormError("");
      setFormSuccess(
        isStaff
          ? "Imóvel cadastrado no catálogo."
          : "Solicitação enviada. Aguarde a aprovação do corretor ou do administrador.",
      );
    },
    onError: (error) => {
      setFormSuccess("");
      setFormError(getErrorMessage(error));
    },
  });

  const aprovarMutation = useMutation({
    mutationFn: (id: number) =>
      backend.request(APROVAR_IMOVEL_MUTATION, { id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["imoveis"] }),
  });

  const recusarMutation = useMutation({
    mutationFn: (id: number) =>
      backend.request(RECUSAR_IMOVEL_MUTATION, { id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["imoveis"] }),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");
    createMutation.mutate();
  }

  const imoveis = imoveisQuery.data?.imoveis ?? [];
  const proprietarios = proprietariosQuery.data?.proprietarios ?? [];
  const canSubmit =
    endereco.trim().length >= 8 &&
    Number(valor.replace(",", ".")) > 0 &&
    fotos.length >= 2 &&
    (!isStaff || Boolean(proprietarioId)) &&
    !createMutation.isPending;

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Imóveis
        </Typography>
        <Typography color="text.secondary">
          {isStaff
            ? "Cadastre o imóvel no catálogo, associado a um proprietário."
            : "Solicite o cadastro do seu imóvel. Ele ficará pendente até a aprovação."}
        </Typography>
      </Box>

      <Paper className="p-6 border border-[#e4d9cc]" elevation={0}>
        <Typography variant="h6" fontWeight={600} className="mb-4">
          {isStaff ? "Novo imóvel" : "Solicitar cadastro"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2"
        >
          <TextField
            select
            label="Tipo"
            value={tipo}
            onChange={(event) => setTipo(event.target.value as TipoImovel)}
            required
          >
            {TIPOS.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
          {isStaff ? (
            <TextField
              select
              label="Proprietário"
              value={proprietarioId}
              onChange={(event) => setProprietarioId(event.target.value)}
              required
            >
              {proprietarios.map((proprietario) => (
                <MenuItem key={proprietario.id} value={String(proprietario.id)}>
                  {proprietario.nome} — {proprietario.email}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              label="Proprietário"
              value={usuario?.nome ?? ""}
              disabled
            />
          )}
          <TextField
            label="Endereço"
            value={endereco}
            onChange={(event) => setEndereco(event.target.value)}
            required
            className="md:col-span-2"
          />
          <TextField
            label="Valor (R$)"
            value={valor}
            onChange={(event) => setValor(event.target.value.replace(/[^\d,.]/g, ""))}
            required
          />
          <Box className="md:col-span-2">
            <PhotosDropzone files={fotos} onChange={setFotos} minFiles={2} />
          </Box>
          <Box className="md:col-span-2 flex items-center gap-3">
            <Button
              type="submit"
              variant="contained"
              className="btn-primary"
              disabled={!canSubmit}
            >
              {createMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : isStaff ? (
                "Cadastrar"
              ) : (
                "Enviar solicitação"
              )}
            </Button>
            {formError && <Alert severity="error">{formError}</Alert>}
            {formSuccess && <Alert severity="success">{formSuccess}</Alert>}
          </Box>
        </Box>
      </Paper>

      <Paper className="p-6 border border-[#e4d9cc]" elevation={0}>
        <Typography variant="h6" fontWeight={600} className="mb-4">
          {isStaff ? "Catálogo" : "Minhas solicitações"}
        </Typography>

        {imoveisQuery.isLoading && (
          <Box className="flex justify-center py-8">
            <CircularProgress />
          </Box>
        )}

        {imoveisQuery.isError && (
          <Alert severity="error">{getErrorMessage(imoveisQuery.error)}</Alert>
        )}

        {!imoveisQuery.isLoading && !imoveisQuery.isError && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fotos</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Proprietário</TableCell>
                <TableCell>Status</TableCell>
                {isStaff && <TableCell>Ações</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {imoveis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isStaff ? 7 : 6}>
                    Nenhum imóvel cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                imoveis.map((imovel) => (
                  <TableRow key={imovel.id}>
                    <TableCell>
                      <Box className="flex gap-1">
                        {imovel.fotos.slice(0, 2).map((foto) => (
                          <img
                            key={foto}
                            src={photoUrl(foto)}
                            alt=""
                            className="h-12 w-12 object-cover rounded border border-[#e4d9cc]"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{tipoLabel(imovel.tipo)}</TableCell>
                    <TableCell>{imovel.endereco}</TableCell>
                    <TableCell>{formatCurrency(imovel.valor)}</TableCell>
                    <TableCell>{imovel.proprietario.nome}</TableCell>
                    <TableCell>{statusChip(imovel.status)}</TableCell>
                    {isStaff && (
                      <TableCell>
                        {imovel.status === "PENDENTE" ? (
                          <Box className="flex gap-2">
                            <Button
                              size="small"
                              variant="contained"
                              className="btn-primary"
                              onClick={() => aprovarMutation.mutate(imovel.id)}
                              disabled={aprovarMutation.isPending}
                            >
                              Aprovar
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => recusarMutation.mutate(imovel.id)}
                              disabled={recusarMutation.isPending}
                            >
                              Recusar
                            </Button>
                          </Box>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    )}
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
