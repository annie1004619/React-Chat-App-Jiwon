import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import { db } from "../firebase";
import { useDispatch } from "react-redux";
import { loadAllChatRooms } from "../reducers/chat";
import NavBar from "../components/ChatList/NavBar";
import { MdRateReview } from "react-icons/md";
import CreateRoomModal from "../components/ChatList/CreateRoomModal";
import AllChatRooms from "../components/ChatList/AllChatRooms";

const ChatList = () => {
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [active, setActive] = useState("all");

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    const chatRef = db.collection("chatRooms");

    chatRef.orderBy("created").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(loadAllChatRooms(data));
    });
  }, [dispatch]);

  return (
    <Container>
      <Header />
      <ChatListContainer>
        <HeaderWrapper>
          <NavBar active={active} setActive={setActive} />
          <MdRateReview
            onClick={toggleModal}
            size={32}
            color="#838383"
            style={{ cursor: "pointer" }}
          />
        </HeaderWrapper>
        {openModal ? <CreateRoomModal toggleModal={toggleModal} /> : ""}
        {active === "all" ? <AllChatRooms /> : ""}
      </ChatListContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;
const ChatListContainer = styled.div`
  background: #f7f6ee;
  margin: 7vh auto;
  width: 60%;
  height: 65vh;
  box-shadow: 0px 6px 15px 6px rgba(200, 200, 200, 0.8);
  border-radius: 50px;
  padding: 5vh 3vw;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4vh;
`;
export default ChatList;
