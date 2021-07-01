import React from "react";
import styled from "styled-components";

const MessageInput = ({ text, onChangeText, onSubmitMessage }) => {
  return (
    <Container>
      <Input
        type="text"
        placeholder="채팅을 입력해주세요."
        value={text}
        onChange={onChangeText}
      />
      <Button onClick={onSubmitMessage}>전송</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Input = styled.input`
  width: 70%;
  height: 5vh;
  border-radius: 5px;
  border: 1px solid #838383;
`;
const Button = styled.button`
  width: 25%;
  height: 5.5vh;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  background: #b9c8ad;
  border-radius: 5px;
  opacity: 0.9;
  :hover {
    opacity: 1;
  }
`;
export default MessageInput;
