import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { firebaseApp, db } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { setUserProfile } from "../reducers/user";
import { RiChatSmile3Line } from "react-icons/ri";

const Login = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.userProfile);
  const history = useHistory();
  const [loginPayload, setLoginPayload] = useState({
    email: "",
    pw: "",
    message: "",
  });

  const onChange = (e, key) => {
    const cp = { ...loginPayload };
    cp[key] = e.target.value;
    setLoginPayload(cp);
  };

  const onSubmit = () => {
    setLoginPayload({ ...loginPayload, message: "" });
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(loginPayload.email, loginPayload.pw)
      .then(() => {
        const uid = (firebaseApp.auth().currentUser || {}).uid;
        if (uid) {
          //사인인 성공
          history.push("/chat/list");
          const userRef = db.collection("users").doc(uid);
          userRef.get().then((snapShot) => {
            const userInfo = snapShot.data();
            dispatch(
              setUserProfile({
                uid: userInfo.uid,
                nickName: userInfo.nickName,
                email: userInfo.email,
              })
            );
          });
        } else {
          alert("해당하는 유저가 없습니다.");
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        setLoginPayload({ ...loginPayload, message: errorMessage });
      });
  };
  //이미 로그인되어있는 경우
  useEffect(() => {
    if (userProfile) {
      history.push("/chat/list");
    } else {
      history.push("/users/login");
    }
  }, []);

  return (
    <Container>
      <Logo>
        <div>WebTalk</div>
        <RiChatSmile3Line />
      </Logo>
      <Title>로그인</Title>
      <Label>이메일</Label>
      <Input
        type="email"
        onChange={(e) => onChange(e, "email")}
        value={loginPayload.email}
        placeholder="이메일을 입력하세요."
      />
      <Label>비밀번호</Label>
      <Input
        type="password"
        onChange={(e) => onChange(e, "pw")}
        value={loginPayload.pw}
        placeholder="비밀번호를 입력하세요."
      />
      <Button type="button" onClick={onSubmit}>
        로그인
      </Button>
      <Error>{loginPayload.message}</Error>
      <StyledLink to="/users/signup">회원이 아니신가요?</StyledLink>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  padding: 2vh 7vw;
  margin: 100px auto;
  height: 500px;
  justify-content: center;
  background: #f7f6ee;
  border-radius: 50px;
  box-shadow: 0px 6px 15px 6px rgba(200, 200, 200, 0.8);
  @media (max-width: 800px) {
    width: 70%;
  }
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  justify-content: center;
  margin-bottom: 5vh;
  color: #0f530d;
`;
const Title = styled.div`
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;
const Label = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #838383;
`;
const Input = styled.input`
  height: 35px;
  margin: 10px 0;
  border: 1px solid #c4c4c4;
`;

const Button = styled.button`
  height: 40px;
  background-color: #a0bbaa;
  border: none;
  cursor: pointer;
  margin-top: 2vh;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  opacity: 0.8;
  :hover {
    opacity: 1;
  }
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 1rem;
  color: black;
  font-weight: bold;
`;
const Error = styled.div`
  margin: 10px 0;
  color: red;
`;
export default Login;
