import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import ChatRoomItem from "./ChatRoomItem";

const AllChatRooms = ({ handleJoin }) => {
  const chatRooms = useSelector((state) => state.chat.allChatRooms);

  return (
    <Container>
      {chatRooms && chatRooms.length === 0 && (
        <Text>현재 채팅방이 없습니다.</Text>
      )}
      {chatRooms &&
        chatRooms.map((chatRoom, index) => (
          <ChatRoomItem
            id={chatRoom.id}
            title={chatRoom.title}
            description={chatRoom.description}
            host={chatRoom.host}
            index={index}
            key={index}
            handleJoin={handleJoin}
          />
        ))}
    </Container>
  );
};

const Container = styled.div`
  overflow-y: scroll;
  height: 85%;
`;
const Text = styled.div`
  font-size: 1.2rem;
  color: #838383;
  text-align: center;
  margin-top: 10vh;
`;
export default AllChatRooms;
