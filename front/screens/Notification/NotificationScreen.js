import {
  Wrapper,
  Container,
  Title,
  TitleText,
  Line,
  RequestBox,
  UserImgView,
  RequestContent,
  RequestTextArea,
  BoldText,
  RequestText,
  RequestBtnArea,
  EmptyRequest,
  EmptyRequestText,
} from "./NotificationScreenStyles"
import { Image } from "react-native";
import { useState, useEffect } from "react";
import TeamRoundBtn from "../../components/Button/TeamRoundBtn/TeamRoundBtn";
import NotificationModal from "../../components/Modal/NotificationModal/NotificationModal";
import colors from "../../styles/colors";
import { apiClient } from "../../customAxios";
import useAuthStore from "./../../store/AuthStore"

import testImg from "./../../assets/images/testProfile1.jpg"
// import testImg2 from "./../../assets/images/testProfile.jpg"

// const testImg = require("./../../assets/images/testProfile1.jpg")
const testImg2 = require("./../../assets/images/testProfile.jpg")

const testMyInfo = {
  marathonList: {
    '무안 마라톤' : {
      teamCode: null,
    }
  }
}
const testMyInfo2 = {
  marathonList: {
    '무안 마라톤' : {
      teamCode: '이미 참여중인 팀 명',
    }
  }
}

const testUsers = [
  {
  userNickName: '신라의 달밤',
  userProfileImg: testImg,
  marathonName: '무안 마라톤',
  teamCode: 1,
  userStatus: true, // 참여중인 팀 있음
  },
  {
  userNickName: '치즈 덕덕',
  userProfileImg: testImg2,
  marathonName: '무안 마라톤',
  teamCode: 2,
  userStatus: false, // 다른 팀에 참여중
  },
]

// const testUsers = []


const NotificationScreen = ({route}) => {
  const {reloadInviteList} = route.params
  const { user } =useAuthStore()
  const [myMarathonList, setMyMarathonList] = useState({})
  const [requestorList, setRequestorList] = useState([])
  const [showAcceptErrorModal, setShowAcceptErrorModal] =useState(false)

  const [targetUserIndex, setTargetUserIndex] = useState(null)  // 초기값을 null로 설정
  const [showRejectRequestModal, setShowRejectRequestModal] =useState(false) // 초대 거절 모달
  const [showAcceptRequestModal, setShowAcceptRequestModal] =useState(false) // 초대 수락 모달


  useEffect(() => {
    getInviteList() // 초대 요청 목록 조회
    reloadInviteList()
  }, [])

  // 참여 불가 모달
  // const acceptErrorModalContent = {
  //   text: `해당 마라톤에\n이미 다른 팀으로\n참여 중입니다.`,
  //   subText: "",
  //   buttons: [
  //     {
  //       title: "확인",
  //       onPress: () => {
  //         setShowAcceptErrorModal(false);
  //       },
  //     },
  //   ],
  // };
  const acceptErrorModalContent = {
    text: `팀 참여\n해당 마라톤의 다른 팀 요청은\n자동 거절됩니다.`,
    subText: "수락할 경우\n해당 마라톤의 다른 팀 요청은\n자동 거절됩니다.",
    buttons: [
      {
        title: "확인",
        onPress: () => {
          setShowAcceptErrorModal(false);
        },
      },
    ],
  };

  // 팀 참여 요청 수락 모달 내용
  const acceptRequestContent = targetUserIndex !== null && targetUserIndex >= 0 && targetUserIndex < requestorList.length
  ? {
      text: `'${requestorList[targetUserIndex].teamName}'팀에\n참여하시겠습니까?`,
      subText: `수락 시 해당 마라톤의 다른 팀\n요청은 자동 거절됩니다.\n대회 명: ${requestorList[targetUserIndex].tournamentName}`,
      buttons: [
        {
          title: "취소",
          onPress: () => {
            cancelAcceptModalBtn()
          },
        },
        {
          title: "수락",
          onPress: () => {
            accept(targetUserIndex);
          },
        },
      ],
    }
  : null;

  // 팀 참여 요청 거절 모달 내용
  const rejectRequestContent = targetUserIndex !== null && targetUserIndex >= 0 && targetUserIndex < requestorList.length
  ? {
      text: `'${requestorList[targetUserIndex].teamName}' 팀\n참여를 거부하시겠습니까?`,
      subText: `대회 명: ${requestorList[targetUserIndex].tournamentName}`,
      buttons: [
        {
          title: "취소",
          onPress: () => {
            cancelRejectModalBtn()
          },
        },
        {
          title: "거부",
          onPress: () => {
            reject(targetUserIndex);
          },
        },
      ],
    }
  : null;

  // 초대 수락 모달-취소 버튼
  const cancelAcceptModalBtn = () => {
    // 수신자 state변수 초기화
    setTargetUserIndex(null)

    // 모달 닫기
    setShowAcceptRequestModal(false);
  }
  
  // 초대 거절 모달-취소 버튼
  const cancelRejectModalBtn = () => {
    // 수신자 state변수 초기화
    setTargetUserIndex(null)

    // 모달 닫기
    setShowRejectRequestModal(false);
  }
  
  // useEffect(() => {
  //   setRequestorList([...testUsers])

  //   const marathonList = testMyInfo['marathonList']
  //   console.log('마라톤 리스트예용...', marathonList)
  //   setMyMarathonList({...marathonList})
  // }, [])

  // [미완_백에 신청 제거 요청은 안 보냄] 거절 버튼
  const reject = async (index) => {
    console.log("수락 버튼 눌린 유저 정보: ", requestorList[index])
    const rejectUser = requestorList[index]
    await inviteConfirm(rejectUser.invitationId, false)

    // const newRequestorList = [...requestorList];
    // newRequestorList.splice(index, 1); // 인덱스에서 요소 하나를 제거합니다.
    // setRequestorList(newRequestorList);
  }

  // [미완] 수락 버튼
// [미완] 수락 버튼
const accept = async (index) => {
  console.log("수락 버튼 눌린 유저 정보: ", requestorList[index])
  const acceptUser = requestorList[index]
  await inviteConfirm(acceptUser.invitationId, true)

  // const marathonName = requestorList[index].marathonName;
  // // 내 정보- 해당 마라톤에서 참여중인 팀이 있는지 확인
  // if (marathonName in myMarathonList) {
  //   // teamCode가 있는지 확인
  //   if (myMarathonList[marathonName].teamCode) {
  //     console.log('이미 팀이 있어욤...');
  //     setShowAcceptErrorModal(true)
  //     reject(index); // 이미 팀이 있으면 요청 삭제
  //   } else {
  //     // 팀이 없으면 joinTeam으로 팀 등록
  //     joinTeam(index, marathonName, requestorList[index].teamCode);
  //   }
  // }
};

const joinTeam = (index, marathonName, teamCode) => {
  console.log('팀이 없어서 가입 진행 중...');
  const copyMyInfo = { ...myMarathonList };
  

  // 해당 마라톤의 teamCode 업데이트
  copyMyInfo[marathonName].teamCode = teamCode;
  setMyMarathonList(copyMyInfo); // 내 마라톤 리스트 갱신
  console.log(myMarathonList)
  reject(index); // 요청 삭제
};

  const getInviteList = async() => {
    try{
      const response = await apiClient.get(
        `/tournament/team/invite/list`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );
      if (response.status === 200) {
        console.log('초대 요청 목록 조회 성공: ', response.data.data)
        const invitationList = response.data.data.invitationList
        setRequestorList(invitationList)
      }
    } catch(error) {
      console.error("초대 요청 목록 조회 에러 발생: ", error)
    }
  }

  const inviteConfirm = async(invitationId, confirm) => {
    console.log("invitation id: ", invitationId, "수락 여부: ", confirm)
    try{
      const response = await apiClient.post(
        `/tournament/team/invite/confirm`,
        {
          invitationId: invitationId,
          accept: confirm
        }
        ,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );
      console.log("팀 초대 요청 처리 성공: ", confirm, response)
      setShowAcceptRequestModal(false) // 모달 닫기
      setShowRejectRequestModal(false) // 모달 닫기
      getInviteList() // 초대 요청 목록 조회
      reloadInviteList()

    } catch(error) {
      console.error("팀 초대 요청 처리 에러 발생: ", error)
    }
  }

  // 거절 버튼 클릭 시
  const onClickReject = (index) => {
    // 타킷인 유저 인덱스 값 담고
    setTargetUserIndex(index)

    // 거절 확인용 모달 띄우기
    setShowRejectRequestModal(true)
  }

  // 수락 버튼 클릭 시
  const onClickAccept = (index) => {
    // 타킷인 유저 인덱스 값 담고
    setTargetUserIndex(index)

    // 수락 확인용 모달 띄우기
    setShowAcceptRequestModal(true)
  }

  return(
    <Wrapper>
      <Container>
        <Title>
          <TitleText>팀 신청</TitleText> 
        </Title>
        <Line />

        { requestorList.length > 0?
        
        requestorList.map((user, index)=>(
          (
            // 참여 요청 리스트
            <RequestBox>
              {/* 프로필 사진 */} 
              <UserImgView>
                <Image
                  style={{width: '100%', height: '100%'}}
                  source={
                    { uri: user.imageUrl }
                  }
                  />
              </UserImgView>
              {/* 프로필 사진 옆 공간\ */}
              <RequestContent>
                <RequestTextArea>
                  <RequestText><BoldText>{user.nickname}</BoldText>님이</RequestText>
                  {/* 나중에 팀 이름 추가하기 */}
                  <RequestText><BoldText>'{user.teamName}' 팀</BoldText> 참여 요청을 보냈습니다. (대회 명: {user.tournamentName}) </RequestText>
                </RequestTextArea>
                <RequestBtnArea>
                  <TeamRoundBtn text={'거절'} onPress={() => onClickReject(index)} backColor={colors.black} />
                  <TeamRoundBtn text={'수락'} onPress={() => onClickAccept(index)} backColor={colors.o_btn} />
                </RequestBtnArea>
              </RequestContent>
            </RequestBox>
          )
        ))
        :
        <EmptyRequest>
          <EmptyRequestText>수신된 요청이 없습니다.</EmptyRequestText>
        </EmptyRequest>
      }

      </Container>
      {showAcceptErrorModal&&(
        <NotificationModal isVisible={showAcceptErrorModal} content={acceptErrorModalContent} />
      )}
      {/* 거절 확인 모달 */}
      {showRejectRequestModal&&
        <NotificationModal isVisible={showRejectRequestModal} content={rejectRequestContent} />
      }
      {/* 수락 확인 모달 */}
      {showAcceptRequestModal&&
        <NotificationModal isVisible={showAcceptRequestModal} content={acceptRequestContent} />
      }
    </Wrapper>
  )
}

export default NotificationScreen