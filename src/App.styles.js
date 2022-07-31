import styled from "styled-components";

export const AppStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Header = styled.header`
  max-width: 600px;
  display: flex;
  flex-direction: column;

  font-weight: 900;

  text-align: center;

  margin-top: 8px;
  margin-bottom: 15px;

  h1 {
    margin-top: 0;
    margin-bottom: 0;
  }
`;

export const Footer = styled.footer`
  font-size: 0.7em;
  margin-top: 25px;
`;

export const Button = styled.button`
  cursor: pointer;

  background: none;
  border: none;

  color: coral;
  transition: color 0.3s ease;

  font-size: 1.3em;
  text-decoration: underline;

  &:hover {
    color: crimson;
  }
`;
