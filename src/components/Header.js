import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { firebaseApp } from "../firebase";
import { setUserProfile } from "../reducers/user";
import { MdAccountCircle } from "react-icons/md";

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.userProfile);
  const onLogout = () => {
    firebaseApp
      .auth()
      .signOut()
      .then(() => {
        dispatch(setUserProfile(null));
        alert("로그아웃되었습니다.");
        history.push("/");
      })
      .catch((error) => {
        alert(error);
      });
  };
  const clickLogo = () => {
    if (userProfile) {
      history.push("/chat/list");
    }
    if (!userProfile) {
      history.push("/");
    }
  };
  return (
    <Container>
      <Logo onClick={clickLogo}>ChatApp</Logo>
      {userProfile ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <MdAccountCircle size={30} style={{ marginRight: "5px" }} />
          <div>{userProfile?.nickName} 님</div>
          <Button onClick={onLogout}>로그아웃</Button>
        </div>
      ) : (
        <Button
          onClick={() => {
            history.push("/users/login");
          }}
        >
          로그인
        </Button>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 0;
  display: flex;
  width: 80%;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  line-height: 80px;
`;
const Logo = styled.div`
  margin-left: 30px;
  font-size: 1.8rem;
  font-weight: bold;
  color: #0f530d;
  cursor: pointer;
`;
const Button = styled.button`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 20px;
  font-size: 0.8rem;
  background: none;
  padding: 5px 10px;
  border: 1px solid;
`;
export default Header;
