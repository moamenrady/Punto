import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://127.0.0.1:5000');

const ChatModal = ({ teamId, user, theme, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const scrollRef = useRef();

    useEffect(() => {
        socket.emit('join_team', teamId);

        axios.get(`http://127.0.0.1:5000/api/v1/messages/${teamId}`).then(res => setMessages(res.data));

        socket.on('receive_message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => socket.off('receive_message');
    }, [teamId]);

    useEffect(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

    const send = () => {
        if (!text.trim()) return;
        socket.emit('send_message', { teamId, senderId: user._id, senderName: user.name, text });
        setText("");
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-lg h-[600px] flex flex-col rounded-2xl ${theme.bg} border ${theme.border}`}>
                <div className={`p-4 flex justify-between bg-gradient-to-r ${theme.btn} text-white`}>
                    <span>Team Chat</span>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.senderId === user._id ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-gray-500">{m.senderName}</span>
                            <div className={`p-2 rounded-xl ${m.senderId === user._id ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
                <div className="p-4 border-t flex gap-2">
                    <input className={`flex-1 p-2 rounded border ${theme.border}`} value={text} onChange={e => setText(e.target.value)} />
                    <button onClick={send} className={`px-4 py-2 rounded text-white bg-indigo-600`}>Send</button>
                </div>
            </div>
        </div>
    );
};
export default ChatModal;