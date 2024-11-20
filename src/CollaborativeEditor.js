import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';

Quill.register('modules/cursors', QuillCursors);

const CollaborativeEditor = ({ docId }) => {
  const editorRef = useRef(null); // Ref to hold the Quill editor DOM element
  const providerRef = useRef(null); // Ref to track the WebSocket provider

  useEffect(() => {
    const ydoc = new Y.Doc();

    // Clean up previous provider if it exists
    if (providerRef.current) {
      providerRef.current.destroy();
    }

    const wsProvider = new WebsocketProvider('ws://localhost:8080/ws/feedback', docId, ydoc);
    providerRef.current = wsProvider;

    const ytext = ydoc.getText('quill');

    // Initialize Quill editor
    const editor = new Quill(editorRef.current, {
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
        ],
        history: {
          userOnly: true,
        },
      },
      placeholder: 'Start collaborating...',
      theme: 'snow', // or 'bubble'
    });

    // Bind Yjs text to the Quill editor
    const binding = new QuillBinding(ytext, editor, wsProvider.awareness);

    // Set awareness information for the user
    wsProvider.awareness.setLocalStateField('user', {
      name: `User-${Math.random().toString(36).substring(2, 7)}`,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    });

    // Cleanup on component unmount or when `docId` changes
    return () => {
      binding.destroy();
      wsProvider.destroy();
      ydoc.destroy();
    };
  }, [docId]); // Recreate the editor whenever `docId` changes

  return <div ref={editorRef} style={{ height: '400px', marginBottom: '16px' }} />;
};

export default CollaborativeEditor;
