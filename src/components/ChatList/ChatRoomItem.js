import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const ChatRoomItem = ({ title, description, index, id, host, handleJoin }) => {
  const history = useHistory();
  const typeList = useSelector((state) => state.user.authType);
  const user = useSelector((state) => state.user.userProfile);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!typeList) return;
    if (!user) return;

    if (user && user.uid === host) {
      setValue("admin");
      return;
    }
    if (typeList.length === 0) setValue("initial");

    if (typeList.some((list) => list.cid !== id)) {
      setValue("initial");
    }
    typeList.forEach(({ cid, type }) => {
      if (id === cid && type === "waiting") {
        setValue("waiting");
        return;
      }
      if (id === cid && type === "accept") {
        setValue("accept");
        return;
      }
    });
  }, [typeList, user, id]);

  const enterChatRoom = () => {
    if (value === "accept" || value === "admin") {
      history.push(`/chat/room/${id}`);
      return;
    }
    alert("가입된 채팅방이 아닙니다.");
  };

  return (
    <Container index={index}>
      <Index>{index + 1}</Index>
      <ContentWrapper>
        <Title onClick={enterChatRoom}>{title}</Title>
        <Description>{description}</Description>
      </ContentWrapper>
      {value === "admin" && <Button color="#d5503d">삭제</Button>}
      {value === "initial" && (
        <Button color="#a0bbaa" onClick={() => handleJoin(id)}>
          가입
        </Button>
      )}
      {value === "waiting" && <Waiting>대기</Waiting>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 2vh 0;
  background: ${(props) => (props.index % 2 === 0 ? "#eae7e1" : "#f3efe6")};
`;
const Index = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  width: 20%;
  text-align: center;
`;
const ContentWrapper = styled.div`
  width: 63%;
`;
const Title = styled.div`
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: bold;
`;
const Description = styled.div`
  width: 90%;
`;
const Button = styled.button`
  background: ${(props) => props.color};
  border: 1px solid ${(props) => props.color};
  cursor: pointer;
  font-size: 1rem;
  padding: 1vh 0;
  width: 50px;
  color: white;
  border-radius: 5px;
  text-align: center;
`;
const Waiting = styled.div`
  background: #c4c4c4;
  border: 1px solid #c4c4c4;
  font-size: 1rem;
  padding: 1vh 0;
  width: 10%;
  color: white;
  border-radius: 5px;
  text-align: center;
`;
export default ChatRoomItem;
