import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpRole from './pages/SignUpRole';
import UserRegister from './pages/UserRegister';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? {
    bg: 'bg-[#12102A]',
    textP: 'text-[#E2E0FF]',
    textM: 'text-[#8480B8]',
    border: 'border-[#2E2B5A]',
    input: 'bg-[#1E1B3A]',
    primary: '#7F6FF5',
    accent: '#3ECFAA',
    btn: 'from-[#7F6FF5] to-[#3ECFAA]'
  } : {
    bg: 'bg-[#F5F4FF]',
    textP: 'text-[#1E1B3A]',
    textM: 'text-[#7F77DD]',
    border: 'border-[#DDD9FF]',
    input: 'bg-white',
    primary: '#534AB7',
    accent: '#0F6E56',
    btn: 'from-[#534AB7] to-[#7F77DD]'
  };

  const commonProps = { isDarkMode, setIsDarkMode, theme };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage {...commonProps} />} />
        <Route path="/signup" element={<SignUpRole {...commonProps} />} />
        <Route path="/signup/user" element={<UserRegister {...commonProps} />} />
        
      </Routes>
    </Router>
  );
}

export default App;