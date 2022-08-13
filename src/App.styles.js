import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

:root {
  --bg: antiquewhite;
  --text: CornflowerBlue;
  --primary: coral;
}

    body {
        margin: 0;
        font-family: "Chivo", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        font-size: 20px;

        background-color: var(--bg);
        color: var(--text);
    }
`;

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

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Footer = styled.footer`
  font-size: 0.7em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 25px;

  a {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.2s ease, text-decoration 0.2s ease;

    &:hover {
      color: crimson;
      text-decoration: underline;
    }
  }
`;

export const Button = styled.button`
  cursor: pointer;

  background: none;
  border: none;

  color: var(--primary);
  transition: color 0.3s ease;

  font-size: 1.3em;

  &:hover {
    color: crimson;
  }
`;
