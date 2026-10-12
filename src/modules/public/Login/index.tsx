import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LOGIN_MUTATION } from "@sr/graphql/auth";
import { useBackend } from "@sr/modules/common/hooks/useBackend";
import { useAuthStore } from "@sr/store/useAuthStore";
import { ClientError } from "graphql-request";
import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

type LoginResponse = {
  login: {
    token: string;
    corretor: {
      id: number;
      nome: string;
      email: string;
      perfil: "ADMIN" | "CORRETOR";
    };
  };
};

export default function Login() {
  const navigate = useNavigate();
  const backend = useBackend();
  const { token, setSession } = useAuthStore();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (token) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await backend.request<LoginResponse>(LOGIN_MUTATION, {
        data: { email, senha },
      });

      setSession(response.login.token, response.login.corretor);
      navigate("/", { replace: true });
    } catch (requestError) {
      const message =
        requestError instanceof ClientError
          ? requestError.response.errors?.[0]?.message
          : "Não foi possível entrar. Tente novamente.";
      setError(message || "E-mail ou senha inválidos.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box className="min-h-screen grid md:grid-cols-2">
      <Box className="hidden md:flex flex-col justify-between bg-[#1f6f5b] text-white p-12">
        <Typography variant="h4" fontWeight={700}>
          Habita
        </Typography>
        <Box>
          <Typography variant="h3" fontWeight={600} className="max-w-md">
            Gestão simples para corretores.
          </Typography>
          <Typography className="mt-4 text-white/80 max-w-sm">
            Acesse o painel para autenticar, cadastrar corretores e proprietários.
          </Typography>
        </Box>
        <Typography variant="body2" className="text-white/70">
          Sistema imobiliário Habita
        </Typography>
      </Box>

      <Box className="flex items-center justify-center p-6 bg-[#f6f1ea]">
        <Paper
          elevation={0}
          className="w-full max-w-md p-8 border border-[#e4d9cc] rounded-2xl"
        >
          <Typography variant="h5" fontWeight={700} className="mb-1">
            Entrar no Habita
          </Typography>
          <Typography color="text.secondary" className="mb-6">
            Use o e-mail e a senha do corretor.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              className="btn-primary h-12"
              disabled={isLoading || !email || !senha}
            >
              {isLoading ? <CircularProgress size={22} color="inherit" /> : "Entrar"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
