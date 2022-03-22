import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Markdown from "markdown-to-jsx";

interface Props {
  typing: boolean;
}

function App() {
  const [content, setContent] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [watchdog, setWatchdog] = useState<NodeJS.Timeout | null>(null);
  const [typing, setTyping] = useState(true);

  function kickTheDog() {
    setTyping(false);
  }

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (document.activeElement !== textAreaRef.current && typing) kickTheDog();
  });

  return (
    <Container typing={typing}>
      <textarea
        placeholder={"Type here..."}
        ref={textAreaRef}
        spellCheck="false"
        className="text"
        onChange={(e) => setContent(e.target.value)}
        onClick={() => setTyping(true)}
        onKeyDown={() => {
          if (watchdog) {
            clearTimeout(watchdog);
            setTyping(true);
          }
          setWatchdog(setTimeout(kickTheDog, 1000));
        }}
      ></textarea>
      <Markdown
        className="md"
        children={content}
        onClick={() => {
          if (document.activeElement !== textAreaRef.current)
            textAreaRef.current?.focus();
          setTyping(true);
        }}
      />
    </Container>
  );
}

const Container = styled.div<Props>`
  display: flex;
  width: 100vw;
  height: 100vh;
  font-size: 12px;
  font-family: arial;
  padding: 32px;
  .text {
    position: relative;
    border: none;
    padding: 0;
    margin: 0;
    resize: none;
    width: 400px;
    font-family: arial;
    font-size: 14px;
    line-height: 18px;
    text-decoration: none;
    height: 200px;
    color: ${({ typing }) => (typing ? "red" : "transparent")};
    background-color: transparent;
    overflow: hidden !important;
  }

  .text::placeholder {
    color: black;
  }

  .md {
    position: absolute;
    font-family: arial;
    font-size: 14px;
    line-height: 18px;
    height: 200px;
    visibility: ${({ typing }) => (!typing ? "visible" : "hidden")};
    color: blue;
    max-height: 200px;
    max-width: 400px;
    word-break: break-all;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #ff0000;
  }
`;

export default App;
