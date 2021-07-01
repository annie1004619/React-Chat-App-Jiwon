import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const ChatRoomItem = ({ title, description, index, id }) => {
  const history = useHistory();
  const enterChatRoom = () => {
    history.push(`/chat/room/${id}`);
  };

  return (
    <Container index={index}>
      <Index>{index + 1}</Index>
      <ContentWrapper>
        <Title onClick={enterChatRoom}>{title}</Title>
        <div>{description}</div>
      </ContentWrapper>
      <Button>가입</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1vh 0;
  background: ${(props) => (props.index % 2 === 0 ? "#e2dfd8" : "#f3efe6")};
`;
const Index = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  width: 15%;
  text-align: center;
`;
const ContentWrapper = styled.div`
  width: 60%;
`;
const Title = styled.div`
  font-size: 1.2rem;
  cursor: pointer;
`;
const Button = styled.button`
  background: none;
  border: 1px solid;
  cursor: pointer;
  font-size: 1rem;
  padding: 1vh 0;
  width: 15%;
`;
export default ChatRoomItem;
