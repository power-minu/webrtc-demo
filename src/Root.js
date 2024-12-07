import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import CollaborativeEditor from './pages/CollaborativeEditor';
import Main from './pages/Main';
import Voice from './pages/Voice';
import Chat from './pages/Chat';

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/editor/:docId" element={<CollaborativeEditor />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/chat/:chatRoomId" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default Root;