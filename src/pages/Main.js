import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const [inputValue, setInputValue] = useState(''); // 텍스트 입력 필드 값 관리
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  const handleNavigate = () => {
    if (inputValue) {
      navigate(`/editor/${inputValue}`); // 입력값을 docId로 사용하여 이동
    }
  };

  const navigateToVoice = () => {
    navigate(`/voice`);
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
    </div>
  );
}

export default Main;