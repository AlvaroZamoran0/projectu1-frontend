import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import creditService from '../services/credit.service';
import documentService from '../services/document.service';
import { Button, Box, Typography, List, ListItem } from '@mui/material';

const SubmitDocument = () => {
  const { idCredit } = useParams();
  const [pdfFiles, setPdfFiles] = useState([]);
  const [requiredDocs, setRequiredDocs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    creditService.get_credit(idCredit)
      .then((response) => {
        const { type_credit } = response.data;
        const docsByType = {
          "First Home": ["Comprobante de ingresos", "Certificado de avalúo", "Historial crediticio"],
          "Second Home": ["Comprobante de ingresos", "Certificado de avalúo", "Escritura de la primera vivienda", "Historial crediticio"],
          "Commercial Properties": ["Estado financiero del negocio", "Comprobante de ingresos", "Certificado de avalúo", "Plan de negocios"],
          "Remodelation": ["Comprobante de ingresos", "Presupuesto de la remodelación", "Certificado de avalúo actualizado"]
        };
        setRequiredDocs(docsByType[type_credit] || []);
      })
      .catch((error) => {
        console.error("Error al obtener detalles del crédito:", error);
      });
  }, [idCredit]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => file.type === "application/pdf");
    setPdfFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const handleUpload = () => {
    const uploadPromises = pdfFiles.map(file => {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('id_credit', idCredit);

      return documentService.save_document(formData);
    });

    Promise.all(uploadPromises)
      .then(() => {
        alert('Documentos subidos con éxito!');
        navigate("/status");
      })
      .catch((error) => {
        console.error("Error al subir documentos:", error);
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Cargar Documentos para el Crédito {idCredit}</Typography>
      <Typography variant="subtitle1">Documentos requeridos:</Typography>
      <List sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {requiredDocs.map((doc, index) => (
          <ListItem key={index} sx={{ justifyContent: 'center' }}>{doc}</ListItem>
        ))}
      </List>

      <Button variant="contained" component="label">
        Subir archivos PDF
        <input type="file" accept="application/pdf" multiple hidden onChange={handleFileChange} />
      </Button>

      {pdfFiles.length > 0 && (
        <ul>
          {pdfFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}

      <Button variant="contained" color="primary" onClick={handleUpload}>
        Enviar Documentos
      </Button>
    </Box>
  );
};

export default SubmitDocument;
