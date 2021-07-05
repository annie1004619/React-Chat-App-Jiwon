import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import { db } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { loadAllChatRooms, removeChatRooms } from "../reducers/chat";
import NavBar from "../components/ChatList/NavBar";
import { MdRateReview } from "react-icons/md";
import CreateRoomModal from "../components/ChatList/CreateRoomModal";
import AllChatRooms from "../components/ChatList/AllChatRooms";
import {
  setAuthAccept,
  setAuthInit,
  setAuthType,
  setAuthWaiting,
} from "../reducers/user";
import MyChatRooms from "../components/ChatList/myChatRooms";

const ChatList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userProfile);
  const typeList = useSelector((state) => state.user.authType);
  const chatRooms = useSelector((state) => state.chat.allChatRooms);

  const [openModal, setOpenModal] = useState(false);
  const [active, setActive] = useState("all");

  const [newParticipants, setNewParticipants] = useState(null);
  const [pSnapShotType, setpSnapShotType] = useState("");
  const [newChatRooms, setNewChatRooms] = useState(null);
  const [cSnapShotType, setcSnapShotType] = useState("");

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const getAllChatRooms = async () => {
    const chatRef = db.collection("chatRooms");
    const snapshot = await chatRef.orderBy("created").get();
    const data = snapshot.docs.map((doc) => ({ ...doc.data() }));
    return data;
  };

  const getMyChatRoom = async () => {
    const authRef = db
      .collection("users")
      .doc(user.uid)
      .collection("participants");
    const snapshot = await authRef.get();
    const data = snapshot.docs.map((doc) => ({ ...doc.data() }));
    return data;
  };

  useEffect(() => {
    if (!user) return;

    Promise.all([getAllChatRooms(), getMyChatRoom()]).then((r) => {
      dispatch(loadAllChatRooms(r[0]));
      dispatch(setAuthType(r[1]));
    });
  }, [user, dispatch]);

  const setChatRoomsWaiting = async (id) => {
    if (!user) return;
    await db
      .collection("chatRooms")
      .doc(id)
      .collection("participants")
      .doc(user.uid)
      .set({ uid: user.uid, type: "waiting", nickName: user.nickName });
  };

  const setUserWaiting = async (id) => {
    if (!user) return;
    await db
      .collection("users")
      .doc(user.uid)
      .collection("participants")
      .doc(id)
      .set({ cid: id, type: "waiting" });
  };

  const handleJoin = async (id) => {
    Promise.all([setChatRoomsWaiting(id), setUserWaiting(id)]).then(() => {
      alert("가입을 신청하였습니다");
    });
  };

  //참가자
  useEffect(() => {
    if (!user) return;

    const participantsRef = db
      .collection("users")
      .doc(user.uid)
      .collection("participants");

    participantsRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newEntry = change.doc.data();
          setNewParticipants(newEntry);
          setpSnapShotType("added");
        }
        if (change.type === "modified") {
          const newEntry = change.doc.data();
          setNewParticipants(newEntry);
          setpSnapShotType("modified");
        }
        if (change.type === "removed") {
          const newEntry = change.doc.data();
          setNewParticipants(newEntry);
          setpSnapShotType("removed");
        }
        setNewParticipants(null);
      });
    });
  }, [user]);

  useEffect(() => {
    if (!newParticipants) return;
    if (!typeList) return;

    const index = typeList.findIndex((p) => p.cid === newParticipants.cid);

    if (pSnapShotType === "added" && index === -1) {
      dispatch(setAuthWaiting({ cid: newParticipants.cid, type: "waiting" }));
      return;
    }
    if (pSnapShotType === "modified") {
      dispatch(setAuthAccept(newParticipants));
    }
    if (pSnapShotType === "removed") {
      dispatch(setAuthInit(newParticipants));
    }
  }, [newParticipants, pSnapShotType]);

  //채팅방
  useEffect(() => {
    if (!user) return;

    const chatRoomsRef = db.collection("chatRooms").orderBy("created");

    chatRoomsRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newEntry = change.doc.data();
          setNewChatRooms(newEntry);
          setcSnapShotType("added");
        }
        if (change.type === "removed") {
          const newEntry = change.doc.data();
          setNewChatRooms(newEntry);
          setcSnapShotType("removed");
        }
        setNewChatRooms(null);
      });
    });
  }, []);

  useEffect(() => {
    if (!chatRooms) return;
    if (!newChatRooms) return;

    const index = chatRooms.findIndex((room) => room.id === newChatRooms.id);

    if (cSnapShotType === "added" && index === -1) {
      return;
    }
    if (cSnapShotType === "removed") {
      dispatch(removeChatRooms(newChatRooms));
    }
  }, [newChatRooms, cSnapShotType]);

  const handleRemoveRoom = (roomId) => {
    const removeAtChatRooms = async () => {
      await db.collection("chatRooms").doc(roomId).delete();
    };
    const getChatRoomParticipants = async () => {
      const chatRoomsRef = await db
        .collection("chatRooms")
        .doc(roomId)
        .collection("participants");
      const snapshot = await chatRoomsRef.get();
      const data = snapshot.docs.map((doc) => ({ ...doc.data() }));
      return data;
    };
    const removeAtUsers = async () => {
      getChatRoomParticipants().then((participants) => {
        if (participants.length === 0) {
          return;
        }
        participants.forEach((item) => {
          db.collection("users")
            .doc(item.uid)
            .collection("participants")
            .doc(roomId)
            .delete();
        });
      });
    };

    Promise.all([removeAtChatRooms(), removeAtUsers()]).then(() => {
      alert("채팅방을 삭제하였습니다.");
    });
  };
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
        {active === "all" && (
          <AllChatRooms
            handleJoin={handleJoin}
            handleRemoveRoom={handleRemoveRoom}
          />
        )}
        {active === "myChatRoom" && (
          <MyChatRooms handleRemoveRoom={handleRemoveRoom} />
        )}
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
  @media (max-width: 800px) {
    width: 90%;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4vh;
`;
export default ChatList;
