// Login.js
import React, { useState } from "react";
import GoogleLoginButton from "../Componant/GoogleLoginButton";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png"; // 이미지를 프로젝트 경로에 맞춰 불러옵니다.

const Login = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* 로고 이미지 */}
      <img src={logo} alt="Logo" className="w-32 h-32 m-4" />

      <h1 className="mb-6 font-bold">MA:ON에 로그인</h1>

      {/* Google 로그인 버튼 */}
      <GoogleLoginButton
        setUserInfo={setUserInfo}
        setToken={setToken}
        navigate={navigate}
      />
    </div>
  );
};

export default Login;
