import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { db, firebaseApp, firebase } from "../firebase";
import { Link } from "react-router-dom";
import { setUserProfile } from "../reducers/user";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [signupPayload, setSignupPayload] = useState({
    email: "",
    pw: "",
    pwConfirm: "",
    nickName: "",
    loading: false,
    message: "",
    signupPath: "",
  });
  const [isAgreeInfo, setIsAgreeInfo] = useState(false);
  const onChange = (e, key) => {
    const cp = { ...signupPayload };
    cp[key] = e.target.value;
    setSignupPayload(cp);
  };
  const updateIsAgreeInfo = () => {
    setIsAgreeInfo(!isAgreeInfo);
  };
  const onSubmit = () => {
    setSignupPayload({ ...signupPayload, loading: true });
    setSignupPayload({ ...signupPayload, message: "" });

    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(signupPayload.email, signupPayload.pw)
      .then(() => {
        const uid = (firebaseApp.auth().currentUser || {}).uid;

        if (uid) {
          const payload = {
            uid: uid,
            nickName: signupPayload.nickName,
            email: signupPayload.email,
            created: firebase.firestore.Timestamp.now().seconds,
            signupPath: signupPayload.signupPath,
          };

          db.collection("users")
            .doc(uid)
            .set(payload)
            .then(() => {
              console.log("Document successfully written!");
              dispatch(setUserProfile(payload));
              alert("회원가입이 완료되었습니다.");
              history.push("/chat/list");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
          //then set next navigation
          //set user for redux
        } else {
          alert("error");
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        setSignupPayload({ ...signupPayload, loading: false });
        setSignupPayload({
          ...signupPayload,
          loading: false,
          message: errorMessage,
        });
      });
  };

  return (
    <Container>
      <Title>회원가입</Title>
      <div>이메일</div>
      <Input
        type="email"
        onChange={(e) => onChange(e, "email")}
        value={signupPayload.email}
        placeholder="이메일을 입력하세요."
      />
      <div>닉네임</div>
      <Input
        onChange={(e) => onChange(e, "nickName")}
        value={signupPayload.nickName}
        placeholder="닉네임을 입력하세요."
      />
      <div>비밀번호</div>
      <Input
        type="password"
        onChange={(e) => onChange(e, "pw")}
        value={signupPayload.pw}
        placeholder="비밀번호를 입력하세요."
      />
      <div>비밀번호 확인</div>
      <Input
        type="password"
        onChange={(e) => onChange(e, "pwConfirm")}
        value={signupPayload.pwConfirm}
        placeholder="비밀번호 확인을 입력하세요."
      />
      <div>가입 경로</div>
      <Select
        value={signupPayload.signupPath}
        onChange={(e) => onChange(e, "signupPath")}
      >
        <option value={"search"}>검색</option>
        <option value={"ads"}>광고</option>
        <option value={"etc"}>이외</option>
      </Select>
      <CheckBoxContainer>
        <div>개인 정보 수집 동의</div>
        <input
          type="checkbox"
          onClick={updateIsAgreeInfo}
          defaultChecked={isAgreeInfo}
          style={{ transform: "scale(1.5)", marginLeft: "20px" }}
        />
      </CheckBoxContainer>
      <Button type="button" onClick={onSubmit}>
        가입하기
      </Button>
      <Error>{signupPayload.message}</Error>
      <Link to="/users/login">이미 회원이신가요?</Link>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  padding: 10vh 10vw;
  margin: 10vh auto;
  justify-content: center;
  box-shadow: 0px 6px 15px 6px rgba(200, 200, 200, 0.8);
  background: #f7f6ee;
  border-radius: 50px;
`;
const Title = styled.div`
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;
const Input = styled.input`
  height: 30px;
  margin: 10px 0 20px 0;
  border: 1px solid #c4c4c4;
`;
const Select = styled.select`
  height: 35px;
  margin: 10px 0;
  border: 1px solid #c4c4c4;
`;

const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const Button = styled.button`
  height: 40px;
  background-color: #85c7b5;
  border: none;
  cursor: pointer;
  margin: 10px 0;
`;

const Error = styled.div`
  margin: 10px 0;
  color: red;
`;
export default SignUp;
