import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import creditService from "../services/credit.service";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const DetailCredit = () => {
  const { idCredit } = useParams();
  const [credit, setCredit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    creditService.get_credit(idCredit)
      .then((response) => setCredit(response.data))
      .catch((error) => console.error("Error al obtener el crédito:", error));
  }, [idCredit]);

  if (!credit) {
    return <Typography>Cargando detalles del crédito...</Typography>;
  }

  // Asocia los estados numéricos con sus descripciones
  const getApprovalStatusText = (status) => {
    switch (status) {
      case 1:
        return "En Evaluación";
      case 2:
        return "Pre-Aprobada";
      case 3:
        return "En Aprobación Final";
      case 4:
        return "En Desembolso";
      case 5:
        return "Rechazada";
      case 6:
        return "Cancelada";
      default:
        return "Desconocido";
    }
  };

  const handleTracking = (id, type) => {
    creditService.tracking(id, type)
      .then(() => {
        // Redirige a la página de estado
        navigate("/status");
      })
      .catch(error => {
        console.error("Error al cancelar/aprobar crédito:", error);
      });
  };

  // Verificar si el botón de cancelar crédito debería estar habilitado
  const isCancelButtonDisabled = credit.approved === 4 || credit.approved === 5 || credit.approved === 0 || credit.approved === -1;
  
  // Verificar si el botón de aceptar crédito debería estar habilitado
  const isAcceptButtonDisabled = credit.approved !== 2;

  return (
    <Paper style={{ padding: "2rem", marginTop: "2rem" }}>
      <Typography variant="h5">Detalles del Crédito</Typography>
      <Divider style={{ margin: "1rem 0" }} />
      <Typography>Documento: {credit.doc}</Typography>
      <Typography>Años de trabajo: {credit.years}</Typography>
      <Typography>Tipo de trabajo: {credit.type_work === 1 ? "Contrato" : "Freelance"}</Typography>
      <Typography>Salario: ${credit.salary}</Typography>
      <Divider style={{ margin: "1rem 0" }} />

      <Typography>
        Costo Total: {credit.approved === 1 || credit.approved === 0 || credit.approved === -1 ? "En revisión" : `$${credit.total_cost}`}
      </Typography>

      <Typography>Monto del Crédito: ${credit.amount}</Typography>
      <Typography>Interés: {credit.interest}%</Typography>
      <Typography>Período: {credit.period} meses</Typography>

      <Typography>
        Cuota Mensual: {credit.approved === 1 || credit.approved === 0 || credit.approved === -1 ? "En revisión" : `$${credit.quota}`}
      </Typography>

      <Typography>Tipo de Crédito: {credit.type_credit}</Typography>
      <Divider style={{ margin: "1rem 0" }} />
      <Typography>Estado de Aprobación: {getApprovalStatusText(credit.approved)}</Typography>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <Button
          variant="outlined"
          color="secondary"
          style={{ marginRight: "1rem" }}
          disabled={isCancelButtonDisabled} // Deshabilitar según la condición
          onClick={() => {
            handleTracking(idCredit, 3)
          }}
        >
          Cancelar Crédito
        </Button>

        <Button
          variant="contained"
          color="primary"
          disabled={isAcceptButtonDisabled} // Deshabilitar según la condición
          onClick={() => {
            handleTracking(idCredit, 1)
          }}
        >
          Aceptar Crédito
        </Button>
      </div>
    </Paper>
  );
};

export default DetailCredit;
