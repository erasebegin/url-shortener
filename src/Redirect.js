import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { retrieveUrl } from "./firebase";
import { ClipLoader } from "react-spinners";

export default function Redirect() {
  const location = useLocation();
  const [error, setError] = useState(false);

  useEffect(() => {
    async function redirect() {
      // slice current path to remove '/'
      const redirectUrl = await retrieveUrl(location.pathname.slice(1));

      if (typeof redirectUrl === "string") {
        window.location.href = redirectUrl;
      } else {
        setError(true);
      }
    }

    redirect();
  }, []);

  if (error) {
    return (
      <StyledRedirectContainer>
        <div>
          <p>This URL doesn't seem to exist 🤷‍♀️</p>
        </div>
      </StyledRedirectContainer>
    );
  }

  return (
    <StyledRedirectContainer>
      <div>
        <ClipLoader />
        <p>Redirecting...</p>
      </div>
    </StyledRedirectContainer>
  );
}

const StyledRedirectContainer = styled.div`
  position: relative;
  height: 100vh;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  p {
    color: black;
    margin-top: 2rem;
  }
`;
