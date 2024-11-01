import httpClient from "../http-common";

const sign_in = data => {
    return httpClient.post('/api/user/sing_in', data);
};

const login = (identification, password) => {
    return httpClient.get(`/api/user/login`, {
        params: {
            identification: identification,
            password: password
        }
    });
};

const get_user = (identification) => {
    return httpClient.get(`/api/user/identification/${identification}`);
};

const calculateAge = (identification) => {
    return httpClient.post(`/api/user/get_age/${identification}`);
};

const update_account = (identification, value) => {
    return httpClient.put(`/api/user/update_account/${identification}/${value}`);
}

export default { sign_in, login, get_user, calculateAge, update_account };