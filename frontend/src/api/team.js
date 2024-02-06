import axios from "./axios";

const gateway = "match";
const url = "teams";

export function getTeamInfo(id, success, fail) {
  axios.get(`/${gateway}/${url}/${id}`).then(success).catch(fail);
}
