# 실시간 공유 문서 편집 데모

<details>
   
   <summary>
      <h2>시연</h2>
   </summary>

   먼저 서버와 클라이언트 프로그램을 실행합니다. 해당 과정은 아래의 '데모 진행 방법'에 설명되어 있습니다.<br><br>
   <img width="1440" alt="1" src="https://github.com/user-attachments/assets/7995a91c-720a-4338-9a6d-b02817be5974">
   <br>브라우저를 여러 개 실행했습니다. 서로 다른 브라우저를 사용해도 됩니다. 저는 크롬 일반 탭 하나, 시크릿 탭 하나 했습니다.<br><br>

   ![2-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/29c53176-4184-45cc-b174-727c2a83f71a)
   <br>둘다 1번 문서로 들어가서, 실시간 동시 편집을 확인했습니다. 다른 동료의 커서위치도 확인할 수 있습니다.<br><br>

   ![3-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/9742e3c6-c115-422b-8347-ac310cdc67bc)
   <br>오른쪽 브라우저에서 2번 문서로 들어가면 1번 문서는 안 보입니다.<br><br>

   ![4-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/184fef22-bba7-4e8b-9178-7888d9381f09)
   <br>왼쪽 브라우저도 2번 문서로 들어가면 공유됩니다.<br><br>

   ![5-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/3af2154e-f030-4f3b-a2bf-0935a6c34ab6)
   <br>데모에서 사용한 텍스트 에디터인 quill은 코드블록도 지원합니다.<br><br>

</details>

## 데모 실행 방법
1. 자바 17버전 설치
2. 터미널에서 해당 프로젝트 위치로 이동
3. npm install
4. 서버 실행 (java -jar webrtc-0.0.1-SNAPSHOT.jar 명령어 실행)
5. 다른 터미널 열고 이 프로젝트에서 npm start
6. 브라우저 여러개 열어서 테스트해보기

## 특이사항
- useEffect가 2번씩 실행돼서 StrictMode를 껐습니다. 끄지 않고도 해결하는 방법을 아신다면 조치해주시면 감사하겠습니다...
- 제가 작성한 프론트 코드는 App.js, CollaborativeEditor.js, index.css 입니다.
   - index.css에는 텍스트에디터인 quill의 디자인 스타일만 추가했습니다.
   - CollaborativeEditor.js에서, docId가 다르면 다른 문서를 보게 됩니다.
- 뭔가 실행이 안 된다면 언제든 알려주시면 감사하겠습니다!
<br><br>

![6-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/6a2f33a4-6649-4f3b-89d4-6b431ef32826)
- 리액트가 미숙해서, 현재 이런 현상이 있습니다...

## 참조
- https://github.com/yjs/yjs-demos
- https://docs.yjs.dev/
