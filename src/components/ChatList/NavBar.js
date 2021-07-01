import React from "react";
import styled from "styled-components";

const NavBar = ({ active, setActive }) => {
  const types = ["all", "myChatRoom"];
  return (
    <div>
      {types.map((type) => (
        <ButtonToggle
          key={type}
          active={active === type}
          onClick={() => setActive(type)}
        >
          {type}
        </ButtonToggle>
      ))}
    </div>
  );
};

const ButtonToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #838383;
  font-weight: bold;
  font-size: 1.3rem;
  margin-right: 15px;
  ${({ active }) =>
    active &&
    `
border-bottom: 3px solid #0F530D;
`}
`;
export default NavBar;
