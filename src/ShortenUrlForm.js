import React, { useState } from "react";
import styled from "styled-components";
import { media } from "styled-bootstrap-grid";
import { addNewUrl } from "./firebase";
// ICONS
import { AiFillInfoCircle } from "react-icons/ai";
import { FaRegCopy } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { BiRefresh } from "react-icons/bi";

const errorMsg = {
  noUrl: "Please enter a URL",
  aliasExists: "This custom url already exists, please try something else",
};

export default function ShortenUrlForm() {
  const [urlToShorten, setUrlToShorten] = useState("");
  const [alias, setAlias] = useState("");
  const [showToolTip, setShowToolTip] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (urlToShorten.length > 0) {
      try {
        const newAlias = await addNewUrl(urlToShorten, alias);
        if (!newAlias) {
          throw new Error("alias already exists");
        } else {
          setAlias(newAlias);
          setSubmitted(true);
          setError("");
        }
      } catch (e) {
        setError(errorMsg.aliasExists);
      }
    } else {
      setError(errorMsg.noUrl);
    }
  }

  function copy() {
    navigator.clipboard.writeText(`${window.location.href}${alias}`);
    setCopied(true);
  }

  function reset() {
    setAlias("");
    setUrlToShorten("");
    setSubmitted(false);
    setCopied(false);
  }
  console.log(errorMsg.noUrl === error);
  if (submitted) {
    return (
      <Submitted>
        <p>Cool, your short URL is:</p>
        <div>
          <code>{`${window.location.href}${alias}`}</code>
          <button onClick={copy}>{copied ? <TiTick /> : <FaRegCopy />}</button>
        </div>
        <p>Copied!</p>
        <button onClick={reset} className="reset">
          <BiRefresh />
        </button>
      </Submitted>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="url-input"
        aria-label="Enter URL"
        type="text"
        placeholder="Enter URL"
        onChange={(e) => setUrlToShorten(e.target.value)}
        value={urlToShorten}
        $error={error === errorMsg.noUrl}
      />
      <div>
        <Input
          name="alias-input"
          aria-label="Custom name"
          type="text"
          placeholder="Custom name"
          onChange={(e) => setAlias(e.target.value)}
          value={alias}
          $error={error === errorMsg.aliasExists}
        />
        <TooltipButton
          onMouseEnter={() => setShowToolTip(true)}
          onMouseLeave={() => setShowToolTip(false)}
        >
          <AiFillInfoCircle />
        </TooltipButton>
      </div>
      <Tooltip $show={showToolTip}>
        <p>
          Choose a custom URL, e.g. entering <b>my-custom-url</b> will create{" "}
          <code>
            <b>/my-custom-url</b>
          </code>
          . Or you can leave this blank to get a random short url
        </p>
      </Tooltip>
      <Button>Submit</Button>
      <Error $show={error.length > 0}>
        <p className="error-text">{error}</p>
      </Error>
    </Form>
  );
}

const Submitted = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff88;
  padding: 4rem 2rem;
  border-radius: 0.3125rem;
  color: #7d6b7d;

  ${media.md`
  margin-top: 30vh;
  `}

  p {
    padding: 1rem;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff88;
    padding: 0.5rem 1rem;
    border-radius: 0.3125rem;
  }

  button {
    margin-left: 0.5rem;
    background: #ffffff88;
    border: white;
    color: #7d6b7d;
    padding: 0.5rem;
    line-height: 0;
    border-radius: 0.3125rem;
    transition: 200ms ease-in-out;

    &:hover {
      background: #7d6b7d;
      color: white;
    }
  }

  .reset {
    font-size: 1.5rem;
    margin: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff55;
  padding: 4rem 2rem;
  border-radius: 0.3125rem;

  ${media.md`
    margin-top: 30vh;
  `}
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: ${(props) => (props.$error ? "2px solid #812f33" : "none")};
  border-radius: 0.3125rem;

  &::placeholder {
    font-family: "Nobile", sans-serif;
  }
`;

const Button = styled.button`
  border: 0;
  padding: 0.75rem 1rem;
  background: #7d6b7d;
  color: white;
  font-weight: bold;
  border-radius: 0.3125rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
    transition: 150ms ease-in-out;
  }
`;

const TooltipButton = styled(Button)`
  padding: 0;
  line-height: 0;
  font-size: 1.25rem;
  border-radius: 50%;
  margin-left: 0.5rem;
  position: absolute;
`;

const Tooltip = styled.div`
  position: relative;
  background: white;
  padding: ${(props) => (props.$show ? "1rem" : 0)};
  margin-bottom: ${(props) => (props.$show ? "1rem" : 0)};
  pointer-events: ${(props) => (props.$show ? "initial" : "none")};
  border-radius: 0.3125rem;
  max-width: 200px;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  max-height: ${(props) => (props.$show ? "1000px" : 0)};
  box-shadow: 0 0 10px #a3a1a888;
  transition: 200ms ease-in-out;

  ${media.md`
    position: absolute;
    right: -75px;
    top: 50%;
    max-height: 100%;
    margin-bottom: 0;
    margin-top:0;
  `}

  b {
    font-size: 0.625rem;
  }

  p {
    font-size: 0.75rem;
    font-weight: 400;
  }
`;

const Error = styled.div`
  background: #812f3311;
  padding: ${(props) => (props.$show ? "1rem" : 0)};
  margin: ${(props) => (props.$show ? "1rem 0" : 0)};
  border-radius: 0.3125rem;
  opacity: ${(props) => (props.$show ? 1 : 0)};
  max-height: ${(props) => (props.$show ? "1000px" : 0)};
  max-width: 300px;
  transition: 200ms ease-in-out;

  .error-text {
    color: #812f33;
    font-weight: 400;
    text-align: center;
    line-height: 1.4rem;
  }
`;
