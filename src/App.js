import React from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import CollaborativeEditor from './CollaborativeEditor';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <h1>Collaborative Editor</h1>
        <nav>
          <Link to="/editor/1">Document 1</Link>
          <br />
          <Link to="/editor/2">Document 2</Link>
        </nav>
        <Routes>
          <Route path="/editor/:docId" element={<EditorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const EditorPage = () => {
  const { docId } = useParams(); // Get the document ID from the URL
  return <CollaborativeEditor docId={docId} />;
};

export default App;
