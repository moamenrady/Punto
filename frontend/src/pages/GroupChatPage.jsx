import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatModal from '../components/ChatModal';

const GroupChatPage = ({ user, theme }) => {
    const [myTeam, setMyTeam] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyTeam = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                
                // مناداة الـ API الجديد اللي بيرجع تيم واحد بناءً على الـ ID
                const res = await axios.get(`http://127.0.0.1:5000/api/v1/teams/user/${user._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // بما إن الـ API بيرجع Object واحد، بنخزنه فوراً بدون .find()
                setMyTeam(res.data);
                
            } catch (err) {
                if (err.response?.status === 404) {
                    console.warn("User has no team assigned yet.");
                    setMyTeam(null);
                } else {
                    console.error("Error fetching team data:", err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchMyTeam();
        }
    }, [user._id]);

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className={`${theme.textP} text-3xl font-bold`}>Group Chats</h1>
                <p className={`${theme.textM} mt-2`}>Collaboration hub for Project Vertex</p>
            </header>

            {myTeam ? (
                <div 
                    onClick={() => setShowChat(true)} 
                    className={`${theme.input} group p-6 border ${theme.border} rounded-2xl cursor-pointer hover:shadow-xl hover:border-indigo-500 transition-all duration-300 relative overflow-hidden`}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        </svg>
                    </div>

                    <h2 className={`${theme.textP} text-xl font-bold mb-2`}>{myTeam.name}</h2>
                    <p className={`${theme.textM} text-sm mb-4 line-clamp-2`}>{myTeam.description}</p>
                    
                    <div className={`pt-4 border-t ${theme.border} flex items-center text-indigo-500 font-semibold`}>
                        Open Team Chat 
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>
            ) : (
                <div className={`text-center py-20 border-2 border-dashed ${theme.border} rounded-2xl`}>
                    <p className={theme.textM}>You are not currently part of any team chats.</p>
                </div>
            )}

            {/* الـ Modal بيفتح لما تختار التيم */}
            {showChat && (
                <ChatModal 
                    teamId={myTeam._id} 
                    user={user} 
                    theme={theme} 
                    onClose={() => setShowChat(false)} 
                />
            )}
        </div>
    );
};

export default GroupChatPage;