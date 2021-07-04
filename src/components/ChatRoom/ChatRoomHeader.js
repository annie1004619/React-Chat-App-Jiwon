import React, { useEffect, useState } from "react";
import { MdGroup } from "react-icons/md";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { MdAssignment, MdExitToApp } from "react-icons/md";
import MangeModal from "./MangeModal";

const ChatRoomHeader = ({ handleAccept, handleReject }) => {
  const [admin, setAdmin] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [acceptNumber, setAcceptNumber] = useState("");

  const user = useSelector((state) => state.user.userProfile);
  const currentChatRoom = useSelector((state) => state.chat.currentChatRoom);
  const participants = useSelector((state) => state.chat.participants);

  useEffect(() => {
    if (!currentChatRoom) return;
    if (!user) return;

    if (currentChatRoom.host === user.uid) {
      setAdmin(true);
    }
    if (currentChatRoom.host !== user.uid) {
      setAdmin(false);
    }
  }, [user, currentChatRoom]);

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    if (!participants) return;
    setAcceptNumber(
      participants.filter(({ type }) => type === "accept").length
    );
  }, [participants]);
  return (
    <HeaderWrapper>
      <Title>{currentChatRoom && currentChatRoom.title}</Title>

      <ParticipantsWrapper>
        <MdGroup size={30} color="#838383" style={{ marginRight: "1vw" }} />
        <div>{acceptNumber + 1}명</div>
        {admin ? (
          <MdAssignment
            size={30}
            color="#838383"
            style={{ marginLeft: "1vw", cursor: "pointer" }}
            onClick={toggleModal}
          />
        ) : (
          <MdExitToApp
            size={30}
            color="#838383"
            style={{ marginLeft: "1vw", cursor: "pointer" }}
          />
        )}
        {openModal && (
          <MangeModal
            toggleModal={toggleModal}
            handleAccept={handleAccept}
            handleReject={handleReject}
          />
        )}
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
