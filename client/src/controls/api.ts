import axios from "axios";

const baseURL = "http://127.0.0.1:5050";

const getTracks = () =>
  axios.get("/signals/tracks", { baseURL }).then((res) => res.data);

export const tracksApi = {
  getTracks,
};
