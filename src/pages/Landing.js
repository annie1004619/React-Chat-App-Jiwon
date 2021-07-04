import React, { useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Landing = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const history = useHistory();
  //이미 로그인되어있는 경우
  useEffect(() => {
    if (userProfile) {
      history.push("/chat/list");
    }
    if (!userProfile) {
      history.push("/users/login");
    }
  }, []);

  return (
    <div>
      <Header />
      <Container>landging</Container>
    </div>
  );
};

const Container = styled.div`
  background: #f7f6ee;
  margin: 7vh auto;
  width: 60%;
  height: 65vh;
  box-shadow: 0px 6px 15px 6px rgba(200, 200, 200, 0.8);
  border-radius: 50px;
  padding: 5vh 3vw;
`;

export default Landing;
