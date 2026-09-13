import { Box, Paper, Typography } from "@mui/material";
import { useAuthStore } from "@sr/store/useAuthStore";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { corretor } = useAuthStore();
  const isAdmin = corretor?.perfil === "ADMIN";

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Olá, {corretor?.nome}. Bem-vindo ao Habita.
        </Typography>
      </Box>

      {isAdmin ? (
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
      ) : (
        <Paper className="p-6 border border-[#e4d9cc]" elevation={0}>
          <Typography variant="overline" className="text-[#1f6f5b]">
            AC 2 — 13/10
          </Typography>
          <Typography variant="h6" fontWeight={600} className="mb-2">
            Em breve
          </Typography>
          <Typography color="text.secondary">
            Na próxima entrega você vai cadastrar proprietários. Essa função
            estará disponível para o corretor e para o administrador.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
