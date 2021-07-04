import React from "react";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import useInput from "../../hooks/useInput";
import { db, firebase } from "../../firebase";
import v4 from "uuid/dist/esm-browser/v4";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const CreateRoomModal = ({ toggleModal }) => {
  const history = useHistory();
  const host = useSelector((state) => state.user.userProfile);
  const [title, onChangeTitle] = useInput("");
  const [description, onChangeDescription] = useInput("");

  const createRoom = () => {
    if (!title) {
      alert("채팅 방 이름을 입력해주세요.");
      return;
    }
    if (!description) {
      alert("채팅 방 설명을 입력해주세요.");
      return;
    }
    const roomId = v4();
    db.collection("chatRooms")
      .doc(roomId)
      .set({
        title: title,
        description: description,
        id: roomId,
        host: host?.uid,
        created: firebase.firestore.Timestamp.now().seconds,
      })
      .then(() => {
        alert("채팅 방 만들기가 완료되었습니다.");
        history.push(`/chat/room/${roomId}`);
        toggleModal();
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <Dimmer>
      <Container>
        <MdClose
          size={25}
          color="black"
          style={{ margin: "1.5vh 0 1.5vh auto", cursor: "pointer" }}
          onClick={toggleModal}
        />
        <Title>새로운 채팅 방 만들기</Title>
        <Label>채팅 방 이름</Label>
        <Input
          type="text"
          placeholder="채팅 방 이름을 입력해주세요."
          value={title}
          onChange={onChangeTitle}
        />
        <Label>채팅 방 설명</Label>
        <Input
          type="description"
          placeholder="채팅 방 설명을 입력해주세요."
          value={description}
          onChange={onChangeDescription}
        />
        <Button onClick={createRoom}>만들기</Button>
      </Container>
    </Dimmer>
  );
};

const Dimmer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #00000080;
  z-index: 100;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 40vw;
  height: 50vh;
  margin: 30vh auto;
  background-color: white;
  z-index: 99;
  box-shadow: 0px 1px 1px rgba(15, 15, 15, 0.2);
  padding: 0 20px;
  border-radius: 5px;
  @media (max-width: 800px) {
    width: 70%;
  }
`;
const Title = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
  margin: 1vh 0;
`;
const Label = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #838383;
  margin: 1vh 0;
`;
const Input = styled.input`
  height: 30px;
  margin-bottom: 2vh;
`;

const Button = styled.button`
  height: 40px;
  background-color: #e1edd4;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 50px;
`;
export default CreateRoomModal;
