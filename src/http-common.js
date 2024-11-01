import axios from "axios";

const creditBackendServer = import.meta.env.VITE_CREDIT_BACKEND_SERVER;
const creditBackendPort = import.meta.env.VITE_CREDIT_BACKEND_PORT;

console.log(creditBackendServer)
console.log(creditBackendPort)

export default axios.create({
    baseURL: `http://${creditBackendServer}:${creditBackendPort}`,
    headers: {
        'Content-Type': 'application/json'
    }
});