import { Box, Paper, Typography } from "@mui/material";
import { useAuthStore } from "@sr/store/useAuthStore";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { usuario } = useAuthStore();
  const isAdmin = usuario?.perfil === "ADMIN";
  const isStaff = isAdmin || usuario?.perfil === "CORRETOR";
  const isOwner = usuario?.perfil === "PROPRIETARIO";

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Olá, {usuario?.nome}. Bem-vindo ao Habita.
        </Typography>
      </Box>

      <Paper className="p-6 border border-[#e4d9cc]" elevation={0}>
        <Typography variant="h6" fontWeight={600} className="mb-2">
          Imóveis
        </Typography>
        <Typography color="text.secondary" className="mb-4">
          {isOwner
            ? "Envie o cadastro do seu imóvel com pelo menos 2 fotos. A solicitação fica pendente até a aprovação."
            : "Cadastre imóveis no catálogo, associados a um proprietário. Solicitações do portal ficam pendentes de aprovação."}
        </Typography>
        <Link to="/imoveis" className="text-[#1f6f5b] font-semibold">
          Ir para imóveis
        </Link>
      </Paper>

      {isStaff && (
        <Paper className="p-6 border border-[#e4d9cc]" elevation={0}>
          <Typography variant="h6" fontWeight={600} className="mb-2">
            Proprietários
          </Typography>
          <Typography color="text.secondary" className="mb-4">
            Cadastre os donos dos imóveis e defina a senha de acesso ao portal.
          </Typography>
          <Link to="/proprietarios" className="text-[#1f6f5b] font-semibold">
            Ir para proprietários
          </Link>
        </Paper>
      )}

      {isAdmin && (
        <Paper className="p-6 border border-[#e4d9cc]" elevation={0}>
          <Typography variant="h6" fontWeight={600} className="mb-2">
            Corretores
          </Typography>
          <Typography color="text.secondary" className="mb-4">
            Só o administrador cadastra e visualiza a equipe comercial.
          </Typography>
          <Link to="/corretores" className="text-[#1f6f5b] font-semibold">
            Ir para corretores
          </Link>
        </Paper>
      )}
    </Box>
  );
}
