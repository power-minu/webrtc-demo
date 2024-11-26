import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import CollaborativeEditor from './pages/CollaborativeEditor';
import Main from './pages/Main';

function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/editor/:docId" element={<CollaborativeEditor />} />
      </Routes>
    </Router>
  );
}

export default Root;