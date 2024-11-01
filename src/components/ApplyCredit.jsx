import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import creditService from '../services/credit.service';
import { Button, TextField, MenuItem, Box } from '@mui/material';

const CreditForm = () => {
  const [Years, setYears] = useState("");
  const [TypeWork, setTypeWork] = useState("");
  const [Salary, setSalary] = useState("");
  const [Amount, setAmount] = useState("");
  const [Interest, setInterest] = useState("");
  const [Period, setPeriod] = useState("");
  const [TypeCredit, setTypeCredit] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const getInterestRange = () => {
    switch (TypeCredit) {
      case "First Home":
        return { min: 3.5, max: 5 };
      case "Second Home":
        return { min: 4, max: 6 };
      case "Commercial Properties":
        return { min: 5, max: 7 };
      case "Remodelation":
        return { min: 4.5, max: 6 };
      default:
        return { min: 0, max: 10 };
    }
  };

  const { min, max } = getInterestRange();

  const handleCreditSubmit = (e) => {
    e.preventDefault();

    if (Interest < min || Interest > max) {
      setErrorMessage(`El interés debe estar entre ${min}% y ${max}% para el tipo de crédito seleccionado.`);
      return;
    }

    setErrorMessage("");

    const document = JSON.parse(localStorage.getItem("Identification"));

    const credit = {
      doc: document,
      years: parseInt(Years),
      type_work: parseInt(TypeWork),
      salary: parseFloat(Salary),
      amount: parseFloat(Amount),
      interest: parseFloat(Interest),
      period: parseInt(Period),
      type_credit: TypeCredit,
    };

    creditService
      .save_credit(credit)
      .then((response) => {
        console.log("Solicitud de crédito creada:", response.data);
        alert("Solicitud de crédito creada con éxito!");
        navigate(`/submit/document/${response.data.idCredit}`); // Redirigir a la página de carga de documentos
      })
      .catch((error) => {
        console.error("Error al crear solicitud de crédito:", error);
      });
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      component="form"
      onSubmit={handleCreditSubmit}
    >
      <h2>Solicitud de Crédito</h2>
      <TextField
        select
        name="typeCredit"
        label="Tipo de Crédito"
        value={TypeCredit}
        onChange={(e) => setTypeCredit(e.target.value)}
      >
        <MenuItem value="First Home">Primera Vivienda</MenuItem>
        <MenuItem value="Second Home">Segunda Vivienda</MenuItem>
        <MenuItem value="Commercial Properties">Propiedades Comerciales</MenuItem>
        <MenuItem value="Remodelation">Remodelación</MenuItem>
      </TextField>
      <TextField
        name="interest"
        label="Interés (%)"
        type="number"
        value={Interest}
        onChange={(e) => setInterest(e.target.value)}
        inputProps={{ min, max, step: 0.1 }}
        helperText={`Rango permitido: ${min}% - ${max}%`}
      />
      {ErrorMessage && <p style={{ color: 'red' }}>{ErrorMessage}</p>}
      <TextField
        name="years"
        label="Antigüedad Laboral (años)"
        type="number"
        value={Years}
        onChange={(e) => setYears(e.target.value)}
      />
      <TextField
        select
        name="typeWork"
        label="Tipo de Trabajo"
        value={TypeWork}
        onChange={(e) => setTypeWork(e.target.value)}
      >
        <MenuItem value={0}>Freelance</MenuItem>
        <MenuItem value={1}>Contrato</MenuItem>
      </TextField>
      <TextField
        name="salary"
        label="Salario"
        type="number"
        value={Salary}
        onChange={(e) => setSalary(e.target.value)}
      />
      <TextField
        name="amount"
        label="Monto"
        type="number"
        value={Amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <TextField
        name="period"
        label="Periodo (años)"
        type="number"
        value={Period}
        onChange={(e) => setPeriod(e.target.value)}
      />

      <Button type="submit" variant="contained" color="primary">
        Solicitar Crédito
      </Button>
    </Box>
  );
};

export default CreditForm;