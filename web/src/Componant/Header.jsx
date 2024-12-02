// src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="bg-gradient-to-r from-[#FF740E] to-[#FFA646] text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/">
        <h1 className="text-2xl font-bold">MA:ON</h1>
      </Link>
      <nav>
        <ul className="flex space-x-4 text-white font-bold">
          <li>
            <Link to="/download" className="">
              다운로드
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
