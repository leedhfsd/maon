import React, { createContext, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null); // 위치 데이터 상태
  const [permissionGranted, setPermissionGranted] = useState(false); // 권한 상태
  const [getData, setGetData] = useState(false);
  const getDataRef = useRef(false);

  const checkPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      setPermissionGranted(false);
      return;
    }
    console.log("Permission granted");
    setPermissionGranted(true); // 권한 승인 상태로 설정
  };
  useEffect(() => {
    checkPermissions();
  }, []); // 컴포넌트가 마운트될 때 한 번 실행

  useEffect(() => {
    let interval;

    const startTracking = async () => {
      interval = setInterval(async () => {
        try {
          const newLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          const { latitude, longitude } = newLocation.coords; // 좌표 추출

          setLocation({ latitude, longitude }); // 위치 데이터 저장
          if (!getDataRef.current) {
            console.log("위치데이터 가져오기 완료");
            setGetData(true);
            getDataRef.current = true;
          }
          // 상태를 직접 사용해 로그 출력
          // console.log("변경된 값: ", { latitude, longitude });
        } catch (error) {
          console.log("위치 요청 실패:", error);
        }
      }, 1000); // 1초 간격으로 위치 요청
    };

    if (permissionGranted) {
      startTracking();
    }

    return () => {
      if (interval) {
        clearInterval(interval); // 컴포넌트 언마운트 시 Interval 제거
      }
    };
  }, [permissionGranted]); // 권한 상태가 변경될 때 실행

  return (
    <LocationContext.Provider value={{ location, permissionGranted, getData }}>
      {children}
    </LocationContext.Provider>
  );
};
