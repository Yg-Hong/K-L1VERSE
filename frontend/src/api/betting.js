import axios from "./axios";

const gateway = "match";
const url = "bettings";

export function betting(data) {
  return axios.post(`/${gateway}/${url}`, data);
}
