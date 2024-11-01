import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import userService from '../services/user.service';
import { Button, TextField, Box } from '@mui/material';

const sign_in = () => {
    const [name, setName] = useState("");
    const [last_name, setLastName] = useState("");
    const [identification, setIdentification] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handlesign_in = (e) => {
        e.preventDefault();
        // Verificar si las contraseñas coinciden
        if (password !== confirmPassword) {
          alert("Las contraseñas no coinciden.");
          return;
        }
    
        // Crear el objeto usuario
        const user = {
          name,
          last_name,
          identification,
          email,
          age,
          password,
          rol:1
        };
    
        userService
          .sign_in(user)
          .then((response) => {
            if (!response || !response.data) {
              alert("No se pudo crear el usuario. Inténtalo de nuevo.");
              return;
            }
            console.log("Usuario registrado:", response.data);
            navigate("/home");
          })
          .catch((error) => {
            console.error("Error al registrar usuario:", error);
          });
      };

      return (
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          component="form"
          onSubmit={handlesign_in}
        >
          <h2>Registro</h2>
          <TextField
            name="name"
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            name="last_name"
            label="Apellido"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            name="identification"
            label="Rut: 12345678-9"
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
          />
          <TextField
            name="email"
            label="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            name="age"
            label="Fecha de Nacimiento"
            type="date"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            name="password"
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            name="confirmPassword"
            type="password"
            label="Reingresar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit">Registrar</Button>
        </Box>
      );
};
export default sign_in;
