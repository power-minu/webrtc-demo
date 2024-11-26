import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

import { MonacoBinding } from 'y-monaco'
import * as monaco from 'monaco-editor'

// @ts-ignore
window.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return '/monaco/dist/json.worker.bundle.js'
    }
    if (label === 'css') {
      return '/monaco/dist/css.worker.bundle.js'
    }
    if (label === 'html') {
      return '/monaco/dist/html.worker.bundle.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/monaco/dist/ts.worker.bundle.js'
    }
    return '/monaco/dist/editor.worker.bundle.js'
  }
}

const CollaborativeEditor = () => {
  const { docId } = useParams();

  const editorRef = useRef(null);
  const providerRef = useRef(null);
  const debounceTimeout = useRef(null); // 디바운스 타이머

  useEffect(() => {
    console.log(process.env.REACT_APP_API_ADDRESS);
    const ydoc = new Y.Doc();

    if (providerRef.current) {
      providerRef.current.destroy();
    }

    const editor = monaco.editor.create(editorRef.current, {
      value: '',
      language: 'javascript',
      theme: 'vs-dark',
    });

    const ytext = ydoc.getText('monaco')

    const saveToServer = async (content) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ADDRESS}/feedback-code/auto/${docId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        });
        console.log(response.json().data);
      } catch (error) {
        console.error('Failed to save content:', error);
      }
    };

    const onTextChange = () => {
      console.log("변화 감지");
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current); // 기존 타이머 삭제
      }
      debounceTimeout.current = setTimeout(() => {
        saveToServer(ytext.toString()); // 변경된 내용을 서버로 저장
      }, 2000); // 2초 디바운스
    };

    const initializeEditor = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ADDRESS}/feedback-code/sessions/${docId}`);
        const data = await response.json();

        if (data.result === 0) {
          const initialDataResponse = await fetch(`${process.env.REACT_APP_API_ADDRESS}/feedback-code/${docId}`);
          const initialFeedbackCode = await initialDataResponse.json();
          if (initialFeedbackCode.result.content) {
            ytext.insert(0, initialFeedbackCode.result.content);
          }
        }
      } catch (error) {
        console.error('Failed to check or fetch initial data:', error);
      } finally {
        initializeWebSocket();
      }
    };

    const initializeWebSocket = () => {
      const wsProvider = new WebsocketProvider('ws://localhost:8080/ws/feedback', docId, ydoc);
      providerRef.current = wsProvider;

      const binding = new MonacoBinding(ytext, editor.getModel(), new Set([editor]), wsProvider.awareness);

      ytext.observe(onTextChange); // Y.Text 변경 감지

      return () => {
        ytext.unobserve(onTextChange);
        binding.destroy();
        wsProvider.destroy();
        ydoc.destroy();
      };
    };

    initializeEditor();
  }, [docId]);

  return <div ref={editorRef} style={{ height: '400px', marginBottom: '16px' }} />;
};

export default CollaborativeEditor;