import axios from "axios";

const baseURL = "http://127.0.0.1:3500";
// const baseURL = "http://localhost:3500";

const getTracks = () =>
  axios.get("/dozor/tracks", { baseURL }).then((res) => res.data);

export const tracksApi = {
  getTracks,
};
