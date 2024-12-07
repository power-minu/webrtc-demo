import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Main = () => {
  const [token, setToken] = useState("");

  const saveToken = () => {
    if (token.trim()) {
      localStorage.setItem("accessToken", `Bearer ${token}`);
      alert("Token saved!");
    }
  };

  const [inputValue, setInputValue] = useState(''); // 텍스트 입력 필드 값 관리
  const [oppValue, setOppValue] = useState(''); // 텍스트 입력 필드 값 관리

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  const handleNavigate = () => {
    if (inputValue) {
      navigate(`/editor/${inputValue}`); // 입력값을 docId로 사용하여 이동
    }
  };

  const navigateToVoice = () => {
    navigate(`/voice`);
  };

  const navigateToChat = async () => {
    const chatRoomId = await axios.post(
      "http://localhost:8080/api/v1/chat/room",
      { opponentId: oppValue },
      {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      }
    )
    .then((response) => {
      navigate(`/chat/${response.data.result}`);
    });
  };

  return (
    <div>
      <h1>Collaborative Editor</h1>
      <div style={{ margin: '10px 0' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // 입력값 업데이트
          placeholder="Enter document ID"
        />
        <button onClick={handleNavigate}>Go</button>
        <button onClick={navigateToVoice}>통화 테스트</button>
      </div>
      <div>
        <input
          type="text"
          value={oppValue}
          onChange={(e) => setOppValue(e.target.value)}
          placeholder="채팅 대상 아이디"
        />
        <button onClick={navigateToChat}>채팅창 가기</button>
      </div>

      <input
        type="text"
        placeholder="사용할 액세스 토큰을 입력하셈"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={saveToken}>Save Token</button>
    </div>
  );
}

export default Main;