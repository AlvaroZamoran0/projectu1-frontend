import { useEffect, useState } from "react";
import creditService from "../services/credit.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Status = () => {
  const [clientCredits, setClientCredits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const n_doc = localStorage.getItem("Identification");
    // Carga las solicitudes del cliente
    creditService
      .get_status(n_doc)
      .then((response) => {
        console.log("Mostrando solicitudes del cliente.", response.data);
        setClientCredits(response.data);
      })
      .catch((error) => {
        console.log("Error al obtener las solicitudes del cliente.", error);
      });
  }, []);

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

  return (
    <div>
      <h1>Estado de las solicitudes</h1>
      {clientCredits.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: "2rem" }}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold", width: "25%" }}>Tipo de Préstamo</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", width: "25%" }}>Monto</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", width: "25%" }}>Estado de Aprobación</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", width: "25%" }}>Detalles</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientCredits.map((credit) => (
                <TableRow key={credit.idCredit}>
                  <TableCell align="center">{credit.type_credit}</TableCell>
                  <TableCell align="center">{credit.amount}</TableCell>
                  <TableCell align="center">{getApprovalStatusText(credit.approved)}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/detail/credit/${credit.idCredit}`)}
                    >
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Status;
