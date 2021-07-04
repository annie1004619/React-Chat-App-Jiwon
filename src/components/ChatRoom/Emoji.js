import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Emoji = ({ value, emojiObj, emojiKey, onClickEmoji, id }) => {
  const user = useSelector((state) => state.user.userProfile);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (emojiObj.includes(user.uid)) {
      setActive(true);
    }
    if (!emojiObj.includes(user.uid)) {
      setActive(false);
    }
  }, [emojiObj]);
  return (
    <EmojiWrapper active={active} onClick={() => onClickEmoji(emojiKey, id)}>
      <div>{value}</div>
      {emojiObj && <div>{emojiObj.length}</div>}
    </EmojiWrapper>
  );
};

const EmojiWrapper = styled.div`
  margin-left: 10px;
  display: flex;
  align-item: center;
  background-color: #b9c8ad;
  width: 50px;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
  opacity: 0.6;
  :hover {
    opacity: 0.9;
  }
  border: 2px solid #b9c8ad;

  ${({ active }) =>
    active &&
    `
    opacity: 0.9;
    border: 2px solid #537755;
`}
`;
export default Emoji;
