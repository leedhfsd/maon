import React from "react";
import BackGroud from "../assets/images/BackGroud.webp";
import Gps from "../assets/images/gps.webp";
import Info from "../assets/images/info.webp";
import Goal from "../assets/images/goal.webp";
import { Link } from "react-router-dom";
import Header from "../Componant/Header";
import Footer from "../Componant/Footer";

const Hero = () => (
  <section
    className="relative bg-cover bg-center py-16 md:py-32"
    style={{
      backgroundImage: `url(${BackGroud})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "400px", // 모바일에서의 최소 높이 설정
    }}
  >
    {/* 어두운 오버레이 추가 */}
    <div className="absolute inset-0 bg-black opacity-60"></div>

    {/* 컨텐츠 영역 */}
    <div className="relative z-10 w-full flex flex-col items-center text-white justify-center px-4 md:px-0">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-[50px] font-bold mb-4 text-ellipsis">
          당신의 마라톤 <span className="text-[#ff7410]">MA:ON</span> 이
          함께합니다
        </h2>

        <p className="mb-6 mt-4 md:mt-[50px] text-sm md:text-base text-ellipsis">
          "MA:ON"와 함께 당신의 러닝 목표를 달성하세요. 개인화된 트레이닝 계획,
          <br />
          실시간 트래킹, 그리고 활발한 러닝 커뮤니티가 기다리고 있습니다.
        </p>
        <Link to="/download">
          <button className="bg-gradient-to-r from-[#FF740E] to-[#FFA646] text-white font-bold px-4 py-2 rounded-full ">
            시작하기
          </button>
        </Link>
      </div>
    </div>
  </section>
);

const FeatureCard = ({ title, description, imgSrc }) => (
  <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col items-center">
    <div className="flex items-center justify-center mb-4">
      <img
        src={imgSrc}
        alt={title}
        className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] object-cover rounded"
      />
    </div>
    <h3 className="text-lg md:text-[25px] font-semibold mb-2 text-center">
      {title}
    </h3>
    <p className="text-center text-sm md:text-base">{description}</p>
  </div>
);

const Features = () => (
  <section id="features" className="py-10 md:py-20 bg-gray-100">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl md:text-[50px] font-bold text-center mb-8 md:mb-10">
        <span className="text-[#ff7410]">MA:ON </span>
        주요 기능
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <FeatureCard
          title="다양한 마라톤 정보"
          description="다양한 마라톤 정보를 얻을 수 있고, 마라톤을 신청 할 수 있습니다."
          imgSrc={Info}
        />
        <FeatureCard
          title="실시간 GPS 트래킹"
          description="정확한 거리, 페이스, 경로를 실시간으로 기록하고 분석합니다."
          imgSrc={Gps}
        />
        <FeatureCard
          title="혼자 마라톤 연습"
          description="혼자 마라톤을 연습하면서 기록을 증진시켜 보세요."
          imgSrc={Goal}
        />
      </div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-col">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
