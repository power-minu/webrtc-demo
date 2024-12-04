import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import '../App.css';

const Voice = () => {
  // 상태 관리
  const [stream, setStream] = useState(null);
  const [myID, setMyID] = useState('');
  const [opponentID, setOpponentID] = useState('');
  const [callStatus, setCallStatus] = useState({
    receiving: false,
    accepted: false,
    caller: '',
  });

  // Refs
  const myVideoRef = useRef(null);
  const opponentVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);

  // 소켓 및 미디어 설정
  useEffect(() => {
    socketRef.current = io("http://220.71.65.69:8081", {
      transports: ["websocket", 'polling'],
      rejectUnauthorized: false
    });

    socketRef.current.emit("hi", {});

    socketRef.current.on("getid", (id) => {
      setMyID(id);
      console.log('내 ID:', id);
    });

    socketRef.current.on('caller', (data) => {
      setCallStatus({
        receiving: true,
        accepted: false,
        caller: data.from,
      });

      // 상대방의 시그널링 데이터 저장
      peerRef.current = { callerSignal: data.signal };
    });

    // 미디어 스트림 요청
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(mediaStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('미디어 스트림 에러:', error);
        alert('카메라와 마이크 접근 권한이 필요합니다.');
      }
    };

    getMediaStream();

    // 컴포넌트 언마운트 시 정리
    return () => {
      socketRef.current.disconnect();

      if (peerRef.current) {
        peerRef.current.destroy();
      }

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 전화 걸기 함수
  const initiateCall = () => {
    if (!opponentID) {
      alert('상대방 ID를 입력하세요.');
      return;
    }

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socketRef.current.emit('caller', {
        toCall: opponentID,
        signalData: data,
        from: myID,
      });
    });

    peer.on('stream', (remoteStream) => {
      if (opponentVideoRef.current) {
        opponentVideoRef.current.srcObject = remoteStream;
      }
    });

    peer.on('error', (err) => {
      console.error('WebRTC 연결 에러:', err);
      alert('통화 연결 중 오류가 발생했습니다.');
    });

    socketRef.current.on('acceptcall', (signal) => {
      setCallStatus(prev => ({ ...prev, accepted: true }));
      peer.signal(signal);
    });

    peerRef.current = peer;
  };

  // 전화 받기 함수
  const answerCall = () => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socketRef.current.emit('answerCall', {
        signal: data,
        to: callStatus.caller
      });
    });

    peer.on('stream', (remoteStream) => {
      if (opponentVideoRef.current) {
        opponentVideoRef.current.srcObject = remoteStream;
      }
    });

    peer.on('error', (err) => {
      console.error('WebRTC 연결 에러:', err);
      alert('통화 연결 중 오류가 발생했습니다.');
    });

    // 이전에 저장된 시그널링 데이터로 연결
    if (peerRef.current?.callerSignal) {
      peer.signal(peerRef.current.callerSignal);
    }

    setCallStatus(prev => ({ ...prev, accepted: true }));
    peerRef.current = peer;
  };

  return (
    <div className="voice-chat-container">
      <div className="connection-info">
        <p>내 ID: {myID || '연결 중...'}</p>
        <div className="call-controls">
          <input
            type="text"
            placeholder="연결할 상대방 ID 입력"
            value={opponentID}
            onChange={(e) => setOpponentID(e.target.value)}
          />
          <button onClick={initiateCall}>통화 걸기</button>
        </div>
      </div>

      {callStatus.receiving && !callStatus.accepted && (
        <div className="incoming-call">
          <p>수신 전화: {callStatus.caller}님의 통화</p>
          <button onClick={answerCall}>통화 받기</button>
        </div>
      )}

      <div className="video-container">
        {stream && (
          <video
            ref={myVideoRef}
            autoPlay
            muted
            playsInline
            style={{ width: '300px' }}
          />
        )}
        {callStatus.accepted && (
          <video
            ref={opponentVideoRef}
            autoPlay
            playsInline
            style={{ width: '300px' }}
          />
        )}
      </div>
    </div>
  );
};

export default Voice;
