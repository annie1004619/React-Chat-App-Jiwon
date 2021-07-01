import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import { db, firebase } from "../firebase";
import {
  addMessage,
  loadIdChatRoom,
  loadMessages,
  modifyMessage,
  removeMessage,
  unLoad,
} from "../reducers/chat";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useInput from "../hooks/useInput";
import v4 from "uuid/dist/esm-browser/v4";
import ChatRoomHeader from "../components/ChatRoom/ChatRoomHeader";
import MessageItem from "../components/ChatRoom/MessageItem";
import MessageInput from "../components/ChatRoom/MessageInput";

const ChatRoom = () => {
  const dispatch = useDispatch();
  const { roomId } = useParams();

  const messages = useSelector((state) => state.chat.messages);
  const user = useSelector((state) => state.user.userProfile);

  const [submitFlag, setSubmitFlag] = useState(false);
  const [newCandidate, setNewCandidate] = useState(null);
  const [snapShotType, setSnapShotType] = useState("");
  const [text, onChangeText, setText] = useInput("");

  const getChatRoomData = async () => {
    const chatRef = await db.collection("chatRooms").doc(roomId);
    const doc = await chatRef.get();
    return doc.data();
  };
  const getMessages = async () => {
    const messageRef = await db
      .collection("chatRooms")
      .doc(roomId)
      .collection("messages");

    const snapshot = await messageRef.orderBy("created").get();
    return snapshot.docs.map((doc) => ({ ...doc.data() }));
  };

  // 처음에 해당 룸의 정보와 메세지들을 가져온다.
  useEffect(() => {
    getChatRoomData().then((r) => {
      dispatch(loadIdChatRoom(r));
    });
    getMessages().then((r) => dispatch(loadMessages(r)));
  }, [dispatch]);

  //서버에서 처리하기 전에 요청 방지
  const doubleSubmitCheck = () => {
    if (submitFlag) {
      return submitFlag;
    } else {
      setSubmitFlag(true);
      return false;
    }
  };

  const onSubmitMessage = async () => {
    if (doubleSubmitCheck()) return;
    const payload = {
      uidOfUser: user.uid,
      nickName: user.nickName,
      content: text,
      uid: v4(),
      created: firebase.firestore.Timestamp.now().seconds,
    };

    await db
      .collection("chatRooms")
      .doc(roomId)
      .collection("messages")
      .doc(payload.uid)
      .set(payload)
      .then(() => {
        setText("");
        setSubmitFlag(false);
      });
  };
  const onUpdateMessage = async (id, newContent) => {
    const messageRef = db
      .collection("chatRooms")
      .doc(roomId)
      .collection("messages")
      .doc(id);

    await messageRef.update({ content: newContent });
  };

  const onRemoveMessage = async (id) => {
    const answer = window.confirm("메세지를 삭제하시겠습니까?");
    if (!answer) return;

    const messageRef = db
      .collection("chatRooms")
      .doc(roomId)
      .collection("messages")
      .doc(id);

    await messageRef.delete();
  };

  useEffect(() => {
    const chatRef = db
      .collection("chatRooms")
      .doc(roomId)
      .collection("messages");
    chatRef.orderBy("created").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newEntry = change.doc.data();
          setNewCandidate(newEntry);
          setSnapShotType("added");
        }
        if (change.type === "modified") {
          const newEntry = change.doc.data();
          newEntry.uid = change.doc.id;
          setNewCandidate(newEntry);
          setSnapShotType("modified");
        }
        if (change.type === "removed") {
          const newEntry = change.doc.data();
          newEntry.uid = change.doc.id;
          setNewCandidate(newEntry);
          setSnapShotType("removed");
        }
        setNewCandidate(null);
      });
    });
  }, []);

  useEffect(() => {
    if (!newCandidate) return;
    const index = messages.findIndex(
      (message) => message.uid === newCandidate.uid
    );
    if (index === -1) {
      dispatch(addMessage(newCandidate));
      return;
    }
    if (snapShotType === "modified") {
      dispatch(modifyMessage(index, newCandidate));
    }
    if (snapShotType === "removed") {
      dispatch(removeMessage(index, newCandidate));
    }
  }, [newCandidate, snapShotType]);

  return (
    <Container>
      <Header />
      <ChatRoomContainer>
        <ChatRoomHeader />
        <MessageListWrapper>
          {messages &&
            messages.map((message, index) => (
              <MessageItem
                key={index}
                content={message.content}
                writerId={message.uidOfUser}
                writer={message.nickName}
                id={message.uid}
                onUpdateMessage={onUpdateMessage}
                onRemoveMessage={onRemoveMessage}
              />
            ))}
        </MessageListWrapper>
        <MessageInput
          text={text}
          onChangeText={onChangeText}
          onSubmitMessage={onSubmitMessage}
        />
      </ChatRoomContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;
const ChatRoomContainer = styled.div`
  background: #f7f6ee;
  margin: 7vh auto;
  width: 60%;
  height: 65vh;
  box-shadow: 0px 6px 15px 6px rgba(200, 200, 200, 0.8);
  border-radius: 50px;
  padding: 5vh 3vw;
`;
const MessageListWrapper = styled.div`
  height: 80%;
  border: 1px solid #838383;
  margin-bottom: 2vh;
  overflow-y: scroll;
`;

export default ChatRoom;
