import React, { useEffect, useState } from "react";
import { MdGroup } from "react-icons/md";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { MdAssignment, MdExitToApp } from "react-icons/md";
import MangeModal from "./MangeModal";

const ChatRoomHeader = ({ handleAccept, handleReject, unSubscribeRoom }) => {
  const participants = useSelector((state) => state.chat.participants);
  const user = useSelector((state) => state.user.userProfile);
  const currentChatRoom = useSelector((state) => state.chat.currentChatRoom);

  const [admin, setAdmin] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [acceptNumber, setAcceptNumber] = useState("");
  const [waiting, setWaiting] = useState([]);
  const [accept, setAccept] = useState([]);

  useEffect(() => {
    if (!participants) return;
    setWaiting(participants.filter((item) => item.type === "waiting"));
    setAccept(participants.filter((item) => item.type === "accept"));
  }, [participants]);

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

      <FlexWrapper>
        <MdGroup size={30} color="#838383" style={{ marginRight: "0.5vw" }} />
        <div>{acceptNumber + 1}명</div>
        <MenuIconWrapper>
          <MdAssignment
            size={30}
            color="#838383"
            style={{ marginLeft: "1vw", cursor: "pointer" }}
            onClick={toggleModal}
          />
          {admin && waiting.length !== 0 && (
            <WaitingNumber>{waiting.length}</WaitingNumber>
          )}
        </MenuIconWrapper>
        {currentChatRoom && (
          <MdExitToApp
            size={30}
            color="#838383"
            style={{ marginLeft: "1vw", cursor: "pointer" }}
            onClick={() => unSubscribeRoom(admin)}
          />
        )}
        {openModal && currentChatRoom && (
          <MangeModal
            toggleModal={toggleModal}
            handleAccept={handleAccept}
            handleReject={handleReject}
            host={currentChatRoom.hostNickName}
            waiting={waiting}
            accept={accept}
            admin={admin}
          />
        )}
      </FlexWrapper>
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
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
`;

const MenuIconWrapper = styled.div`
  position: relative;
  display: flex;
`;
const WaitingNumber = styled.div`
  position: absolute;
  top: -10px;
  right: -5px;
  background: #e34f33;
  width: 20px;
  text-align: center;
  border-radius: 50%;
  height: 20px;
  line-height: 20px;
  font-size: 0.8rem;
  color: white;
  font-weight: bold;
`;

export default ChatRoomHeader;
