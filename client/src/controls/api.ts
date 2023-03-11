import axios from "axios";

const baseURL = "http://127.0.0.1:5050";

const getSignals = () =>
  axios.get("/signals", { baseURL }).then((res) => res.data);

export const signalsApi = {
  getSignals,
};
