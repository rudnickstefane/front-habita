import { Box, Paper, Typography } from "@mui/material";
import { useAuthStore } from "@sr/store/useAuthStore";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { corretor } = useAuthStore();

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

      <Paper className="p-6 border border-[#e4d9cc]" elevation={0}>
        <Typography variant="h6" fontWeight={600} className="mb-2">
          Corretores
        </Typography>
        <Typography color="text.secondary" className="mb-4">
          Cadastre e visualize a equipe comercial desta primeira entrega.
        </Typography>
        <Link to="/corretores" className="text-[#1f6f5b] font-semibold">
          Ir para corretores
        </Link>
      </Paper>
    </Box>
  );
}
