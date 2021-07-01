import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { MdAccountCircle } from "react-icons/md";
import useInput from "../../hooks/useInput";

const MessageItem = ({
  content,
  writer,
  writerId,
  id,
  onUpdateMessage,
  onRemoveMessage,
}) => {
  const [updateMode, setUpdateMode] = useState(false);
  const [newContent, onChangeNewContent, setNewContent] = useInput(content);
  const user = useSelector((state) => state.user.userProfile);
  const onChangeUpdateMode = () => {
    setUpdateMode(!updateMode);
    setNewContent(content);
  };

  const onClickComplete = () => {
    onUpdateMessage(id, newContent)
      .then(() => setUpdateMode(false))
      .catch((error) => console.log(error));
  };

  const onClickRemove = () => {
    setUpdateMode(false);
    onRemoveMessage(id)
      .then(() => setUpdateMode(false))
      .catch((error) => console.log(error));
  };

  if (user && user.uid === writerId) {
    return (
      <MyBalloon>
        <TopWrapper>
          <Wrapper>
            <MdAccountCircle size={30} style={{ marginRight: "5px" }} />
            {writer}
          </Wrapper>
          {updateMode ? (
            <Wrapper>
              <Button onClick={onClickComplete}>완료</Button>
              <Button onClick={onChangeUpdateMode}>취소</Button>
            </Wrapper>
          ) : (
            <Wrapper>
              <Button onClick={onChangeUpdateMode}>수정</Button>
              <Button onClick={onClickRemove}>삭제</Button>
            </Wrapper>
          )}
        </TopWrapper>
        {updateMode ? (
          <Input
            type="text"
            value={newContent}
            onChange={onChangeNewContent}
            placeholder="수정할 채팅을 입력해주세요."
          />
        ) : (
          <Content>{content}</Content>
        )}
      </MyBalloon>
    );
  }

  return (
    <Balloon>
      <Wrapper>
        <MdAccountCircle size={30} style={{ marginRight: "5px" }} />
        {writer}
      </Wrapper>
      <Content>{content}</Content>
    </Balloon>
  );
};

const MyBalloon = styled.div`
 position: relative;
background: #F2F4C5;
border-radius: 10px;
}
  margin: 5vh 5vw;
  width: 80%;
    height: 14vh;
:after {
content: '';
position: absolute;
right: 0;
top: 50%;
width: 0;
height: 0;
border: 20px solid transparent;
border-left-color: #F2F4C5;
border-right: 0;
border-bottom: 0;
margin-top: -10px;
margin-right: -20px;
}
`;
const Balloon = styled.div`
  position: relative;
  margin: 5vh 5vw;
  width: 80%;
  height: 14vh;
  background: #f3efe6;
  border-radius: 10px;
  :after {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-right-color: #f3efe6;
    border-left: 0;
    border-bottom: 0;
    margin-top: -10px;
    margin-left: -20px;
  }
`;
const TopWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 95%;
`;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  padding-top: 1vh;
  margin-left: 1vw;
`;
const Content = styled.div`
  margin-top: 2vh;
  margin-left: 1vw;
  font-size: 1rem;
`;
const Button = styled.button`
  background: none;
  border: none;
  font-weight: bold;
  color: gray;
  cursor: pointer;
`;
const Input = styled.input`
  margin-left: 1vw;
  margin-top: 1vh;
  width: 90%;
  height: 5vh;
  border-radius: 5px;
  border: 1px solid #838383;
`;
export default MessageItem;
