// Home.js
import React from "react";
import { useLocation } from "react-router-dom";

const GoogleLogin = () => {
  const location = useLocation();
  const { userInfo, token } = location.state || {};

  if (!userInfo || !token) {
    return <p>로그인 정보가 없습니다.</p>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Welcome, {userInfo.name}!</h2>
      <p>Email: {userInfo.email}</p>
      <img
        src={userInfo.picture}
        alt="Profile"
        style={{ borderRadius: "50%", width: "100px", height: "100px" }}
      />
      <h3>Access Token:</h3>
      <p>{token}</p>
    </div>
  );
};

export default GoogleLogin;
