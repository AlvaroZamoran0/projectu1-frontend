import httpClient from "../http-common";

const save_document = (data) => {
    return httpClient.post('/api/document/save_doc', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const download_documents = (id) => {
    return httpClient.get(`/api/document/download/${id}`, {
        responseType: 'blob' // Configura el tipo de respuesta como blob
    });
}

export default { save_document, download_documents };