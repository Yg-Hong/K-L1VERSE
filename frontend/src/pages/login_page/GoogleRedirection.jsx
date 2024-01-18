import React from "react";

import axios from "../../api/axios";

function GoogleRedirection() {
  const PARAMS = new URL(document.location).searchParams;
  const GOOGLE_CODE = PARAMS.get("code");
  //   const code = window.location.search;
  //   console.log(code);
  console.log("GOOGLE_CODE:", GOOGLE_CODE);

  const request = axios
    .get(`/login/oauth/code/google?code=${GOOGLE_CODE}`)
    .then((res) => {
      console.log(res);

      /* access Token 받고 전역 변수로 관리 */
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("profile", res.data.profile);

      /* 성공시 홈화면으로 */
      // window.location.href = "/";
    })
    .catch((err) => {
      console.log(err);
      window.location.href = "/login";
    });

  console.log(request);

  return <div>로그인 중입니다.</div>;
}

export default GoogleRedirection;
