import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import creditService from '../services/credit.service';
import { Button, TextField, Box, Typography } from '@mui/material'; // Agregué Typography aquí

const SimulateCredit = () => {
  const [years, setYears] = useState("");
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [simulationResult, setSimulationResult] = useState(null);

  const handleSimulate = (e) => {
    e.preventDefault();

    if (!amount || !interest || !years) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    setErrorMessage("");

    creditService
      .simulate_credit(amount, interest, years)
      .then((response) => {
        console.log("Simulación de crédito:", response.data);
        setSimulationResult(response.data); // Guarda el resultado en el estado
      })
      .catch((error) => {
        console.error("Error en la simulación de crédito:", error);
        setErrorMessage("Error al realizar la simulación. Por favor, intente de nuevo.");
      });
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      component="form"
      onSubmit={handleSimulate}
    >
      <h2>Simulación de Crédito</h2>

      <TextField
        name="amount"
        label="Monto"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <TextField
        name="interest"
        label="Interés anual (%)"
        type="number"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
      />
      <TextField
        name="years"
        label="Periodo (años)"
        type="number"
        value={years}
        onChange={(e) => setYears(e.target.value)}
      />

      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      <Button type="submit" variant="contained" color="primary">
        Simular Crédito
      </Button>

      {simulationResult && (
        <Box sx={{ mt: 3 }}>
          <Typography>Cuota Mensual: ${simulationResult.toFixed(0)}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SimulateCredit;
