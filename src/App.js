import styled from "styled-components";
import { Container, Row, Col, media } from "styled-bootstrap-grid";
import ShortenUrlForm from "./ShortenUrlForm";
import gradientAnimation from "./styles/gradientAnimation";

function App() {
  return (
    <AppContainer>
      <Container>
        <Row>
          <Col md={6} mdOrder={1}>
            <PageText>
              <h1>Enter a URL</h1>
              <p>Please enter the URL that you would like to shorten.</p>
            </PageText>
          </Col>
          <Col md={6} mdOrder={0}>
            <ShortenUrlForm />
          </Col>
        </Row>
      </Container>
    </AppContainer>
  );
}

const AppContainer = styled.main`
  background: linear-gradient(270deg, #FFF587, #FF8C64);
  background-size: 400% 400%;
  height: 100vh;

  ${gradientAnimation}

  h1 {
    font-weight: 700;
    color: #7D6B7D;
    margin-bottom: 1rem;
  }

  p {
    color: #7D6B7D;
    font-weight: bold;
  }
`;

const PageText = styled.div`
  padding: 2rem;

  ${media.md`
    margin-top: 30vh;
  `}
`;

export default App;
