import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import creditService from "../services/credit.service";
import userService from "../services/user.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

const Principal = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [credits, setCredits] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar el permiso del usuario
    const permiso = JSON.parse(localStorage.getItem("Permiso"));
    const n_doc = localStorage.getItem("Identification");
    setIsAdmin(permiso === 2);

    // Solo cargar la lista de créditos si el usuario es administrador
    if (permiso === 2) {
      creditService
        .get_approved(4)
        .then((response) => {
          console.log("Mostrando listado de todos los créditos.", response.data);
          setCredits(response.data);
        })
        .catch((error) => {
          console.log("Error al obtener la lista de créditos.", error);
        });
    }

    // Obtener la información del usuario si es cliente
    if (permiso ===1) {
      userService
        .get_user(n_doc)
        .then((response) => {
          console.log("Mostrando información del usuario.", response.data);
          setUser(response.data);
        })
        .catch((error) => {
          console.log("Error al obtener la información del usuario.", error);
        });
    }

  }, []);

  return (
    <div>
      <h1>Bienvenido a Prestabanco</h1>
      {isAdmin ? (
        // Vista para el administrador
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>N° Documento</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Tipo Trabajo</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Tipo de Crédito</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Monto</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Años</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Operaciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {credits.map((credit) => (
                <TableRow key={credit.idCredit}>
                  <TableCell align="center">{credit.doc}</TableCell>
                  <TableCell align="center">{credit.type_work === 1 ? "Contrato" : "Freelance"}</TableCell>
                  <TableCell align="center">{credit.type_credit}</TableCell>
                  <TableCell align="center">{credit.amount}</TableCell>
                  <TableCell align="center">{credit.years}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => navigate(`/revision/credit/${credit.idCredit}`)}
                    >
                      Revisar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Vista para el cliente
        <div>
          <h2>Información de la cuenta</h2>
          {user && (
            <div>
              <p><strong>Nombre:</strong> {user.name} {user.last_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Saldo:</strong> ${user.balance}</p>
            </div>
          )}
          <Button
            variant="contained" 
            color="primary"
            onClick= {() => navigate("/apply/credit")}
          >
            Solicitar Crédito
          </Button>
          <Button
            variant="outlined"
            color="primary"
            style={{ marginLeft: "1rem" }}
            onClick={() => navigate("/status")}
          >
            Ver Estado de Solicitudes
          </Button>
        </div>
      )}
    </div>
  );
};

export default Principal;
