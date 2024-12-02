// GoogleLoginButton.js
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // named export로 가져옵니다.

const GoogleLoginButton = ({ setUserInfo, setToken, navigate }) => {
  const clientId =
    "440199819883-gcepu2hg885mqeqkdue00dagrphri08u.apps.googleusercontent.com";

  const handleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const decoded = jwtDecode(token); // jwtDecode로 수정

    setToken(token);
    setUserInfo(decoded);

    // 웹용 navigate 사용
    const appRedirectUrl = `maon://redirect?token=${encodeURIComponent(
      token
    )}&name=${encodeURIComponent(decoded.name)}&email=${encodeURIComponent(
      decoded.email
    )}`;

    //console.log("Redirecting to:", appRedirectUrl);

    //console.log("Redirecting to:", appRedirectUrl);
    window.location.href = appRedirectUrl;
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={(error) => console.error("Login Failed", error)}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
