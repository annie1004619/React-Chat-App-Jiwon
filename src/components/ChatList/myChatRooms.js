import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import ChatRoomItem from "./ChatRoomItem";

const MyChatRooms = ({ handleRemoveRoom }) => {
  const [myRooms, setMyRooms] = useState([]);
  const user = useSelector((state) => state.user.userProfile);
  const allChatRooms = useSelector((state) => state.chat.allChatRooms);
  const typeList = useSelector((state) => state.user.authType);

  useEffect(() => {
    if (!allChatRooms) return;
    if (!typeList) return;
    if (!user) return;
    const rooms = allChatRooms.filter(({ host }) => host === user.uid);
    setMyRooms(rooms);

    allChatRooms.forEach((room) => {
      typeList.forEach(({ cid, type }) => {
        if (room.id === cid && type === "accept") {
          setMyRooms((currRoom) => currRoom.concat(room));
        }
      });
    });
  }, [allChatRooms, user, typeList]);

  return (
    <Container>
      {myRooms.map((chatRoom, index) => (
        <ChatRoomItem
          id={chatRoom.id}
          title={chatRoom.title}
          description={chatRoom.description}
          host={chatRoom.host}
          index={index}
          key={index}
          handleRemoveRoom={handleRemoveRoom}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  overflow-y: scroll;
  height: 85%;
`;
export default MyChatRooms;
