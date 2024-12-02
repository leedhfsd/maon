// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/LoginScreen";
import GoogleLogin from "./pages/GoogleLogin";
import Home from "./pages/Home";
import DownloadPage from "./pages/Download";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Download" element={<DownloadPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/googleLogin" element={<GoogleLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
