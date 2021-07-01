import React from "react";
import { MdGroup } from "react-icons/md";
import styled from "styled-components";
import { useSelector } from "react-redux";

const ChatRoomHeader = () => {
  const currentChatRoom = useSelector((state) => state.chat.currentChatRoom);
  return (
    <HeaderWrapper>
      <Title>{currentChatRoom && currentChatRoom.title}</Title>
      <ParticipantsWrapper>
        <MdGroup size={30} color="#838383" style={{ marginRight: "1vw" }} />
        <div>00명</div>
      </ParticipantsWrapper>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  color: #838383;
  font-size: 1.2rem;
`;
const ParticipantsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
`;
export default ChatRoomHeader;
