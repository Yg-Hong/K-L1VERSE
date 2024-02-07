import React from "react";
import styled from "styled-components";

import NaverImg from "../../assets/login_button/naver_img.png";

function NaverLoginButton() {
  const NAVER_REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI;
  const NAVER_STATE = process.env.REACT_APP_NAVER_STATE;
  const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${NAVER_STATE}`;

  const handleLogin = () => {
    window.location.href = NAVER_AUTH_URL;
  };

  return (
    <NaverLoginContainer>
      <NaverLogo src={NaverImg} alt="네이버 로고" onClick={handleLogin} />
      <LoginButton type="button" onClick={handleLogin}>
        네이버 로그인
      </LoginButton>
    </NaverLoginContainer>
  );
}

const LoginButton = styled.button`
  width: 138px;
  height: 45px;
  border: none;
  background-color: transparent;
  cursor: pointer;

  padding: 1px 35px 1px 6px;

  background-color: #03c75a;

  border-radius: 0 6px 6px 0;
`;

const NaverLogo = styled.img`
  width: 45px;
  height: 45px;

  border-radius: 6px 0 0 6px;
`;

const NaverLoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: box-shadow 0.5s ease;
  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`;

export default NaverLoginButton;
