# 실시간 공유 문서 편집 데모

## 데모 진행 방법
1. 자바 17버전 설치
2. 터미널에서 해당 프로젝트 위치로 이동
3. npm install
4. 서버 실행 (java -jar webrtc-0.0.1-SNAPSHOT.jar 명령어 실행)
5. 다른 터미널 열고 이 프로젝트에서 npm start
6. 브라우저 여러개 열어서 테스트해보기

## 참고사항
- useEffect가 2번씩 실행돼서 StrictMode를 껐습니다. 끄지 않고도 해결하는 방법을 아신다면 조치해주시면 감사하겠습니다...
- 제가 작성한 프론트 코드는 App.js, CollaborativeEditor.js, index.css 입니다. index.css에는 텍스트에디터인 quill의 디자인 스타일만 추가했습니다.
   - CollaborativeEditor.js에서, docId가 다르면 다른 문서를 보게 됩니다.