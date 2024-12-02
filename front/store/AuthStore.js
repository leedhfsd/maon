// store/AuthStore.js
import { create } from 'zustand';


const AuthStore = create((set) => ({
  user: {
    id: null,
    name: null,
    email: null,
    accessToken: null,
    refreshToken: null,
    imageUrl: null,
    nickname: null,
    height: null,
    weight: null,
    birthDate: null,
    address: null,
    gender: null,
    phoneNumber: null,
  },

  // // 사용자 정보 설정 함수
  // setUser: (userInfo) => set({
  //   user: {
  //     id: userInfo.id,
  //     name: userInfo.name,
  //     email: userInfo.email,
  //     accessToken: userInfo.accessToken,
  //     refreshToken: userInfo.refreshToken,
  //     imageUrl: userInfo.imageUrl,
  //   }
  // }),
  
  // 기존 사용자 정보를 유지하면서 부분 업데이트 가능
  setUser: (userInfo) => set((state) => ({
    user: {
      ...state.user,
      ...userInfo,
    }
  })),

  // 로그아웃 시 사용자 정보 초기화 함수
  clearUser: () => set({
    user: {
      id: null,
      name: null,
      email: null,
      accessToken: null,
      refreshToken: null,
      imageUrl: null,
      nickname: null,
      height: null,
      weight: null,
      birthDate: null,
      address: null,
      gender: null,
      phoneNumber: null,
    }
  }),
}));

export default AuthStore;
