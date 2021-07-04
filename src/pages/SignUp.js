import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { db, firebaseApp, firebase } from "../firebase";
import { Link } from "react-router-dom";
import { setUserProfile } from "../reducers/user";
import { useDispatch } from "react-redux";
import { RiChatSmile3Line } from "react-icons/ri";
import { validateEmail, validatePW } from "../util/formCheck";

const SignUp = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [signupPayload, setSignupPayload] = useState({
    email: "",
    pw: "",
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
    if (!signupPayload.email) {
      setSignupPayload({ ...signupPayload, message: "이메일을 입력해주세요." });
      return;
    }
    if (!validateEmail(signupPayload.email).result) {
      const message = validateEmail(signupPayload.email).message;
      setSignupPayload({ ...signupPayload, message: message });
      return;
    }
    if (!signupPayload.nickName) {
      setSignupPayload({ ...signupPayload, message: "닉네임을 입력해주세요." });
      return;
    }
    if (!signupPayload.pw) {
      setSignupPayload({
        ...signupPayload,
        message: "비밀번호를 입력해주세요.",
      });
      return;
    }
    if (!validatePW(signupPayload.pw).result) {
      const message = validatePW(signupPayload.pw).message;
      setSignupPayload({ ...signupPayload, message: message });
      return;
    }
    console.log(!validateEmail(signupPayload.pw).result);
    if (!isAgreeInfo) {
      setSignupPayload({
        ...signupPayload,
        message: "개인 정보 수집에 동의해주세요.",
      });
      return;
    }

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
            join: [],
          };

          db.collection("users")
            .doc(uid)
            .set(payload)
            .then(() => {
              console.log("Document successfully written!");
              dispatch(
                setUserProfile({
                  uid: payload.uid,
                  nickName: payload.nickName,
                  email: payload.email,
                })
              );
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
      <Logo>
        <div>WebTalk</div>
        <RiChatSmile3Line />
      </Logo>
      <Title>회원가입</Title>
      <Label>이메일</Label>
      <Input
        type="email"
        onChange={(e) => onChange(e, "email")}
        value={signupPayload.email}
        placeholder="이메일을 입력하세요."
      />
      <Label>닉네임</Label>
      <Input
        onChange={(e) => onChange(e, "nickName")}
        value={signupPayload.nickName}
        placeholder="닉네임을 입력하세요."
      />
      <Label>비밀번호</Label>
      <Input
        type="password"
        onChange={(e) => onChange(e, "pw")}
        value={signupPayload.pw}
        placeholder="비밀번호를 입력하세요."
      />
      <Label>가입 경로</Label>
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
      <StyledLink to="/users/login">이미 회원이신가요?</StyledLink>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  padding: 10vh 10vw;
  margin: 20px auto;
  justify-content: center;
  box-shadow: 0px 6px 15px 6px rgba(200, 200, 200, 0.8);
  background: #f7f6ee;
  border-radius: 50px;
  @media (max-width: 400px) {
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
const Select = styled.select`
  height: 40px;
  margin: 10px 0;
  border: 1px solid #c4c4c4;
`;

const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const Error = styled.div`
  margin: 10px 0;
  color: red;
`;
export default SignUp;
