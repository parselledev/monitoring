import axios from "axios";

const baseURL = "http://194.58.121.20:3500";
// const baseURL = "http://localhost:3500";

const getSignals = () =>
  axios.get("/dozor/signals", { baseURL }).then((res) => res.data);

export const tracksApi = {
  getSignals,
};
