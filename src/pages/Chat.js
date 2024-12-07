import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';
import { Client, Stomp } from "@stomp/stompjs";
import SockJS from 'sockjs-client';

const Chat = () => {
    const { chatRoomId } = useParams();

    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        // const stompClient = new Client(headers, () => {
        //     brokerURL: `ws://localhost:8080/ws/chat`, // Spring Boot WebSocket URL
        //     webSocketFactory: () => new SockJS("http://localhost:8080/ws/chat"), // SockJS 사용
        //     onConnect: () => {
        //         console.log("Connected");
        //         stompClient.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
        //             const body = JSON.parse(message.body);
        //             setMessages((prev) => [...prev, body]);
        //         });
        //     },
        //     debug: (str) => console.log(str),
        // });
        // stompClient.activate();

        const headers = { Authorization: token };
        const socket = new SockJS('http://localhost:8080/ws/chat');
        let options = { debug: false };
        const stompClient = Stomp.over(socket, options);
        stompClient.connect(headers, (frame) => {
            console.log('소켓 연결 성공', frame);
            stompClient.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
                const body = JSON.parse(message.body);
                setMessages((prev) => [...prev, body]);
            })
        }, (error) => {
            console.log('연결실패');
            console.log(error)
        })

        setClient(stompClient);

        return () => stompClient.deactivate();
    }, []);

    const sendMessage = () => {
        if (client && input.trim()) {
            client.publish({
                destination: `/app/chat.sendMessage/${chatRoomId}`,
                body: JSON.stringify({
                    authorization: token,
                    content: input,
                    type: "CHAT"
                }),
            });
            setInput("");
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        {/*<strong>{msg.senderId}:</strong>*/} {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
