import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import userService from '../services/user.service';
import { Button, TextField, Box } from '@mui/material';
import { AuthContext } from './AuthContext';

const Login = () => {
    const [identification, setIdentification] = useState("");
    const [password, setPassword] = useState("");
    const { login_context } = useContext(AuthContext);
    const navigate = useNavigate();

    const handlelogin = (e) => {
        e.preventDefault();
    
        // Crear el objeto usuario
        const user = {
          identification,
          password,
        };
    
        userService
          .login(user.identification, user.password)
          .then((response) => {
            const userData = response.data;

            // Verificar si el usuario existe en la respuesta
            if (userData) {
              // Guardar los datos en localStorage solo si userData no es null
              localStorage.setItem("Permiso", userData.rol);
              localStorage.setItem("UserId", userData.id);
              localStorage.setItem("UserName", userData.name);
              localStorage.setItem("UserLastName", userData.last_name);
              localStorage.setItem("UserBalance", userData.balance);
              localStorage.setItem("Identification", userData.identification);

              // Llamar a login_context solo si el usuario existe
              login_context(userData.rol);
              console.log("Sesión iniciada:", response.data);
              navigate("/principal");
            } else {
              // Muestrar una alerta si no se encontró el usuario
              alert("No se pudo iniciar sesión: Usuario o contraseña incorrectos.");
            }
          })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error);
          alert("Hubo un error al intentar iniciar sesión. Inténtalo de nuevo.");
        });
      };

      return (
        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          component="form"
          onSubmit={handlelogin}
        >
            <p></p>
          <TextField
            name="identification"
            label="Rut: 12345678-9"
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
          />
          <TextField
            name="password"
            type="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Iniciar sesión</Button>
        </Box>
      );
};
export default Login;
