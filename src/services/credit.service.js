import httpClient from "../http-common";

const get_approved = (approved) => {
    return httpClient.get(`/api/credit/pre_approved/${approved}`);
};

const get_status = (doc) => {
    return httpClient.get(`/api/credit/status/${doc}`);
};

const get_credit = (credit) => {
    return httpClient.get(`/api/credit/${credit}`);
};

const tracking = (id, type) => {
    return httpClient.put(`/api/credit/tracking/${id}/${type}`);
};

const next_step = (id) => {
    return httpClient.put(`/api/credit/next_step/${id}`);
};

const save_credit = data => {
    return httpClient.post('/api/credit/saveCredit', data);
};

const simulate_credit = (amount, interest, years) => {
    return httpClient.post(`/api/credit/simulate/${amount}/${interest}/${years}`);
};

const step_1 = (id) => {
    return httpClient.post(`/api/credit/step_1/${id}`);
};

const step_3 = (id) => {
    return httpClient.post(`/api/credit/step_3/${id}`);
};

const step_4 = (id, debt) => {
    return httpClient.post(`/api/credit/step_4/${id}/${debt}`);
};

const step_5 = (id, value) => {
    return httpClient.post(`/api/credit/step_5/${id}/${value}`);
};

const step_6 = (age, period) => {
    return httpClient.post(`/api/credit/step_6/${age}/${period}`);
};

const step_7 = (value) => {
    return httpClient.post(`/api/credit/step_7/${value}`);
};

const total_cost = (id, amount, interest, period) => {
    return httpClient.put(`api/credit/total_cost/${id}/${amount}/${interest}/${period}`);
}
export default { get_approved, get_status, get_credit, tracking, save_credit, simulate_credit, step_1, step_3, step_4,
    step_5, step_6, step_7, total_cost, next_step };