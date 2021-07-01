import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { firebaseApp, db } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import { setUserProfile } from "../reducers/user";

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
            dispatch(setUserProfile(snapShot.data()));
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
    }
  }, []);

  return (
    <Container>
      <Title>로그인</Title>
      <div>이메일</div>
      <Input
        type="email"
        onChange={(e) => onChange(e, "email")}
        value={loginPayload.email}
        placeholder="이메일을 입력하세요."
      />
      <div>비밀번호</div>
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
      <Link to="/users/signup">회원이 아니신가요?</Link>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  padding: 0 50px;
  margin: 10% auto;
  height: 500px;
  justify-content: center;
  background: #f7f6ee;
  border-radius: 50px;
  box-shadow: 0px 6px 15px 6px rgba(200, 200, 200, 0.8);
`;
const Title = styled.div`
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;
const Input = styled.input`
  height: 30px;
  margin: 10px 0;
  border: 1px solid #c4c4c4;
`;

const Button = styled.button`
  height: 40px;
  background-color: #85c7b5;
  border: none;
  cursor: pointer;
`;
const Error = styled.div`
  margin: 10px 0;
  color: red;
`;
export default Login;
