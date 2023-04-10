import axios from "axios";

// const baseURL = "http://146.185.235.115:3500";
const baseURL = "http://localhost:3500";

const getTracks = () =>
  axios.get("/dozor/tracks", { baseURL }).then((res) => res.data);

export const tracksApi = {
  getTracks,
};
