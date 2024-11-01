import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import creditService from "../services/credit.service";
import documentService from "../services/document.service";
import userService from "../services/user.service";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";

const RevisionCredit = () => {
  const { idCredit } = useParams();
  const [credit, setCredit] = useState(null);
  const [relation, setRelation] = useState(null); 
  const [evaluationText, setEvaluationText] = useState(""); 
  const [debt, setDebt] = useState(0); 
  const [debtRatio, setDebtRatio] = useState(null);
  const [propertyValue, setPropertyValue] = useState(0);
  const [financingPercentage, setFinancingPercentage] = useState('');
  const [step6Result, setStep6Result] = useState('');
  const [age, setUserAge] = useState(null);
  const [checkboxValue, setCheckboxValue] = useState(false); // Estado para la casilla de verificación
  const [checkedItems, setCheckedItems] = useState([false, false, false, false, false]);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [totalCost, setTotalCost] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    creditService.get_credit(idCredit)
      .then((response) => {
        setCredit(response.data);
      })
      .catch((error) => console.error("Error al obtener el crédito:", error));
  }, [idCredit]);

  const handleTracking = (id, type) => {
    creditService.tracking(id, type)
      .then(() => {
        navigate("/principal");
      })
      .catch(error => {
        console.error("Error al actualizar crédito:", error);
      });
  };

  const handleNextStep = (idCredit) => {
    creditService.next_step(idCredit)
      .then(() => {
        return creditService.get_credit(idCredit);
      })
      .then((response) => {
        setCredit(response.data); 
      })
      .catch(error => {
        console.error("Error al pasar a la siguiente revisión:", error);
      });
  };
  

  const handleDownloadDocuments = () => {
    console.log("Descargando documentos...");
    
    documentService.download_documents(idCredit)
      .then((response) => {
        if (response && response.data) {
          const blob = new Blob([response.data], { type: 'application/zip' });
          const url = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `documents_credit_${idCredit}.zip`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      })
      .catch(error => {
        console.error("Error al descargar documentos:", error);
      });
  };

  const handleCalculateDebtRatio = () => {
    creditService.step_4(credit.idCredit, debt)
      .then((response) => {
        console.log("Relación deuda/ingreso calculada:", response.data);
        setDebtRatio(response.data);
      })
      .catch((error) => {
        console.error("Error al calcular la relación deuda/ingreso:", error);
      });
  };

  const handleCalculateFinancingPercentage = () => {
    creditService.step_5(idCredit, propertyValue)
      .then((response) => {
        setFinancingPercentage(response.data);
      })
      .catch((error) => {
        console.error("Error al calcular el porcentaje de financiamiento:", error);
      });
  };

  const handleEvaluate = () => {
    if (!credit) return;

    switch (credit.status) {
      case 1:
        creditService.step_1(idCredit)
          .then((result) => {
            setRelation(result.data);
          });
        break;
      case 3:
        creditService.step_3(idCredit)
          .then((result) => {
            setEvaluationText(result.data);
          });
        break;
      case 6:
        const userId = credit.doc;
        userService.calculateAge(userId)
          .then((ageResult) => {
            const AGE = ageResult.data;
            const period = credit.period;
            setUserAge(AGE);
            return creditService.step_6(AGE,period);
          })
          .then((result) => {
            setStep6Result(result.data);
          });
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index]; // Alternar el valor de la casilla
    setCheckedItems(newCheckedItems);
  };

  const calculateCheckedSum = () => {
    const sum = checkedItems.filter(Boolean).length; // Contar los true
    console.log('Suma de casillas marcadas:', sum);
    creditService.step_7(sum)
      .then((res) => {
        console.log('Respuesta de la evaluación:', res.data);
        setEvaluationResult(res.data); // Guardar el resultado en el estado
      })
      .catch((error) => {
        console.error('Error al evaluar:', error);
      });
  };

  const calculateTotalCost = (id, amount, interest, period) => {
    creditService.total_cost(id, amount, interest, period)
      .then((response) => {
        setTotalCost(response.data); // Actualizar el estado con el costo total recibido
        console.log('Costo total calculado:', response.data);
      })
      .catch((error) => {
        console.error('Error al calcular el costo total:', error);
      });
  };

  const handleApproveAndTrack = (idCredit, identification, value) => {
    // Llama a la función para actualizar el valor de la cuenta
    userService.update_account(identification, value) // Actualizar la cuenta con el valor proporcionado
      .then((response) => {
        console.log('Valor de la cuenta actualizado:', response.data);
  
        // Después de que se haya actualizado la cuenta, llama a handleTracking
        handleTracking(idCredit, 1);
        navigate("/principal");
      })
      .catch((error) => {
        console.error('Error al actualizar el valor de la cuenta:', error);
      });
  };
  

  if (!credit) {
    return <Typography>Cargando detalles del crédito...</Typography>;
  }

  const isRejectButtonDisabled = credit.approved === 2;

  return (
    <Paper style={{ padding: "2rem", marginTop: "2rem" }}>

      {credit.status === 1 && (
        <>
          <Typography variant="h5">Detalles del Crédito</Typography>
          <Divider style={{ margin: "1rem 0" }} />
          <Typography>Monto del Crédito: ${credit.amount}</Typography>
          <Typography>Interés: {credit.interest}%</Typography>
          <Typography>Período: {credit.period} meses</Typography>
          <Typography>Tipo de Crédito: {credit.type_credit}</Typography>
          <Divider style={{ margin: "1rem 0" }} />
          <Typography variant="h6">Relación Cuota/Ingreso: {relation}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleEvaluate}
            style={{ margin: "1rem 0" }}
          >
            Evaluar Crédito
          </Button>
        </>

      )}

      {credit.status === 2 && (
        <>
          <Divider style={{ margin: "1rem 0" }} />
          <Typography variant="body1">
            Se revisa el historial crediticio del cliente en DICOM (Rechazar si hay morosidades).
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadDocuments}
            style={{ marginTop: "1rem" }}
          >
            Descargar Documentos
          </Button>
        </>
      )}

      {credit.status === 3 && (
        <>
          <Divider style={{ margin: "1rem 0" }} />
          <Typography variant="h6">Evaluación de Estabilidad Laboral</Typography>
          <Typography paragraph style={{ textAlign: "justify" }}>
            Esta evaluación se centra en la estabilidad laboral del cliente, analizando su 
            antigüedad en el empleo actual y su historial laboral en los últimos años. Es 
            fundamental que el cliente tenga un mínimo de 1 a 2 años de antigüedad en su 
            empleo actual. En el caso de los trabajadores independientes, se examinan los 
            ingresos de los últimos 2 años o más para determinar su estabilidad financiera.
          </Typography>
          <Typography variant="body1" paragraph>
            Respuesta: {evaluationText}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleEvaluate}
            style={{ margin: "1rem 0" }}
          >
            Evaluar Crédito
          </Button>
        </>
      )}

      {credit.status === 4 && (
        <>
          <Divider style={{ margin: "1rem 0" }} />
          <Typography variant="h6">Cálculo de Relación Deuda/Ingreso</Typography>
          <Typography>
            Si la suma de todas las deudas (incluyendo la cuota proyectada del nuevo crédito)
            supera el 50% de los ingresos mensuales, la solicitud debe ser rechazada.
          </Typography>
          <TextField
            type="number"
            label="Ingrese el total de deudas"
            value={debt}
            onChange={(e) => setDebt(e.target.value)} 
            fullWidth
            margin="normal"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCalculateDebtRatio}
          >
            Calcular Relación Deuda/Ingreso
          </Button>
          {debtRatio !== null && (
            <Typography variant="body1" style={{ marginTop: "1rem" }}>
              Relación Deuda/Ingreso: {debtRatio}%
            </Typography>
          )}
        </>
      )}

      {credit.status === 5 && (
        <>
          <Divider style={{ margin: "1rem 0" }} />
          <Typography variant="h6">Cálculo de Porcentaje Máximo de Financiamiento</Typography>
          <Typography>Tipo de propiedad: {credit.type_credit} </Typography>
          <Typography>Primera Vivienda 80% de la propiedad; </Typography>
          <Typography>Segunda Vivienda 70% de la propiedad; </Typography>
          <Typography>Propiedades Comerciales 60% de la propiedad</Typography>
          <Typography>Remodelación 50% del valor actual de la propiedad.</Typography>
          <TextField
            type="number"
            label="Ingrese el valor de la propiedad"
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCalculateFinancingPercentage}
          >
            Calcular Porcentaje de Financiamiento
          </Button>
          {financingPercentage && ( // Muestra el resultado solo si existe
            <Typography variant="body1" style={{ marginTop: "1rem" }}>
              Porcentaje de Financiamiento: {financingPercentage}
            </Typography>
          )}
        </>
      )}

      {credit.status === 6 && (
        <>
          <Divider style={{ margin: "1rem 0" }} />
          <Typography variant="h6">Edad del solicitante</Typography>
          <Typography>
          El solicitante debe tener 5 años o menos de margen antes de alcanzar la edad máxima de 75 años al finalizar el plazo del préstamo.
          </Typography>
          {step6Result && (
            <Typography variant="body1" style={{ marginTop: "1rem" }}>
              Evaluación: {step6Result}
            </Typography>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleEvaluate}
            style={{ margin: "1rem 0" }}
          >
            Evaluar Crédito
          </Button>
        </>
      )}

      {credit.status === 7 && ( // Mostrar cuadro y tabla si status es 7
        <>
          <Divider style={{ margin: '1rem 0' }} />
          <Typography variant="h6">Confirmación de Aprobación</Typography>
          <Typography>
            Marque las casillas correspondientes para la aprobación del crédito.
          </Typography>

          <TableContainer style={{ marginTop: '1rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Criterio</TableCell>
                  <TableCell>Cumplimiento</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['Saldo Mínimo Requerido', 'Historial de Ahorro Consistente', 'Depósitos Periódicos', 'Relación Saldo/Años de Antigüedad', 'Retiros Recientes'].map((desc, index) => (
                  <TableRow key={index}>
                    <TableCell>{desc}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={checkedItems[index]}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateCheckedSum}
              style={{ marginBottom: '1rem' }}
            >
              Confirmar
            </Button>
          </Box>

          {evaluationResult && ( // Mostrar resultado de la evaluación si está disponible
            <Typography variant="body1" style={{ marginTop: '1rem' }}>
              Resultado de la evaluación: {evaluationResult}
            </Typography>
          )}
        </>
      )}

      {credit.status === 8 && credit.approved === 1 && ( // Mostrar información del crédito si status es 8
        <>
          <Divider style={{ margin: '1rem 0' }} />
          <Typography variant="h6">Información del Crédito</Typography>
          <Typography>Monto del Crédito: ${credit.amount}</Typography>
          <Typography>Interés: {credit.interest}%</Typography>
          <Typography>Período: {credit.period} meses</Typography>
          <Typography>Tipo de Crédito: {credit.type_credit}</Typography>

          <Button 
          variant="contained" 
          color="primary" 
          onClick={() => calculateTotalCost(credit.idCredit, credit.amount, credit.interest, credit.period)}
          style={{ marginTop: '1rem' }}
          >
          Calcular Costo Total
          </Button>

          {totalCost !== null && ( // Asegúrate de tener un estado para manejar esto
            <>
              <Typography variant="body1" style={{ marginTop: '1rem' }}>
                Costo Total: ${totalCost.total_cost.toFixed(0)}
              </Typography>
              <Typography variant="body1" style={{ marginTop: '0.5rem' }}>
                Cuotas: ${totalCost.quota.toFixed(0)}
              </Typography>
            </>
          )}
      </>
      )}

      {credit.status === 8 && credit.approved === 2 && (
        <>
          <Divider style={{ margin: '1rem 0' }} />
          <Typography variant="h6">ESPERANDO RESPUESTA DEL CLIENTE...</Typography>
          <Typography variant="h6">Información del Crédito</Typography>
          <Typography>Monto del Crédito: ${credit.amount}</Typography>
          <Typography>Interés: {credit.interest}%</Typography>
          <Typography>Período: {credit.period} meses</Typography>
          <Typography>Tipo de Crédito: {credit.type_credit}</Typography>
          <Typography>Costo total: ${credit.total_cost.toFixed(0)}</Typography>
          <Typography>Cuota: ${credit.quota.toFixed(0)}</Typography>
        </>
      )}

      {credit.status === 8 && credit.approved === 3 && (
        <>
          <Divider style={{ margin: '1rem 0' }} />
          <Typography variant="h6">Información del Crédito</Typography>
          <Typography>Monto del Crédito: ${credit.amount}</Typography>
          <Typography>Interés: {credit.interest}%</Typography>
          <Typography>Período: {credit.period} meses</Typography>
          <Typography>Tipo de Crédito: {credit.type_credit}</Typography>
          <Typography>Costo total: ${credit.total_cost.toFixed(0)}</Typography>
          <Typography>Cuota: ${credit.quota.toFixed(0)}</Typography>
          <p></p>
          <Typography>Crédito aceptado por el cliente, aprobar para liberal el monto</Typography>
        </>
      )}

      <Box mt={2}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={() => handleTracking(credit.idCredit, 2)}
          disabled={false}
        >
          Rechazar Crédito
        </Button>

        {credit.status !== 8 && ( // Verifica que el status no sea 8
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleNextStep(credit.idCredit)} // Llama a la función para pasar a la siguiente etapa
            style={{ marginLeft: '1rem' }}
          >
            Siguiente Etapa
          </Button>
        )}

        {credit.status === 8 ? ( // Verifica si el status es 8
          credit.approved === 2 || credit.approved === 1 ? (
          <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleTracking(credit.idCredit, 1)}
              style={{ marginLeft: '1rem' }}
              disabled={credit.status === 8 && credit.approved === 2}
          >
              Pre-Aprobar Crédito
          </Button>
          ) : credit.approved === 3 ? (
          <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleApproveAndTrack(credit.idCredit, credit.doc, credit.amount)}
              style={{ marginLeft: '1rem' }}
          >
              Aprobar Crédito
          </Button>
          ) : null
      ) : null}
      </Box>
  </Paper>
  );
};

export default RevisionCredit;
