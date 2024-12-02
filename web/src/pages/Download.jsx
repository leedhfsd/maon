import React from "react";
import Header from "../Componant/Header";
import Footer from "../Componant/Footer";
import { QRCodeCanvas } from "qrcode.react"; // QRCodeCanvas 사용

export default function DownloadPage() {
  const downloads = [
    {
      title: "앱 다운로드",
      apkUrl:
        "https://i.pinimg.com/736x/ad/51/df/ad51df1235a8841524bc3afe4df6d0a1.jpg",
      qrValue:
        "https://i.pinimg.com/736x/ad/51/df/ad51df1235a8841524bc3afe4df6d0a1.jpg",
    },
    {
      title: "워치 앱 다운로드",
      apkUrl:
        "https://img.danawa.com/images/descFiles/4/500/3499558_1511922898058.jpeg",
      qrValue:
        "https://img.danawa.com/images/descFiles/4/500/3499558_1511922898058.jpeg",
    },
  ];

  return (
    <div className="flex flex-col relative min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
          다운로드 페이지
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {downloads.map((download, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 md:p-6 flex flex-col items-center"
            >
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">
                {download.title}
              </h2>
              <div className="flex justify-center mb-4">
                <QRCodeCanvas
                  value={download.qrValue}
                  size={120} // 모바일 화면에서 QR 코드 크기 조정
                  className="md:size-150 rounded-md shadow"
                />
              </div>
              <a
                href={download.apkUrl}
                download
                className="bg-gradient-to-r from-[#FF740E] to-[#FFA646] hover:from-[#FFA646] hover:to-[#FF740E] text-white font-bold py-2 px-3 md:py-2 md:px-4 rounded-full w-full md:w-[300px] text-center transition-all"
              >
                APK 다운로드
              </a>
              <p className="mt-4 text-xs md:text-sm text-gray-600 text-center">
                QR 코드를 스캔하여 다운로드하세요
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
