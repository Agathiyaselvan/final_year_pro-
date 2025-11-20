import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LandingContainer = styled.div`
  min-height: 100vh;
  background: #000000;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #cccccc;
  text-align: center;
  margin-bottom: 3rem;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  width: 100%;
  margin-bottom: 3rem;
`;

const Card = styled(motion.div)`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid ${props => props.color};
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const CardNumber = styled.div`
  background: ${props => props.color};
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled.h3`
  color: ${props => props.color};
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CardText = styled.p`
  color: #cccccc;
  font-size: 0.95rem;
  line-height: 1.4;
`;

const StartButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/auth');
  };

  return (
    <LandingContainer>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Post-Quantum Cryptography
      </Title>
      
      <Subtitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Secure your digital future.
      </Subtitle>

      <CardsContainer>
        <Card
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          color="#ff4757"
        >
          <CardNumber color="#ff4757">1</CardNumber>
          <CardContent>
            <CardTitle color="#ff4757">The Problem</CardTitle>
            <CardText>
              Traditional cryptography is vulnerable to quantum attacks. When quantum computers become powerful enough, they will break RSA and ECC.
            </CardText>
          </CardContent>
        </Card>

        <Card
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          color="#2ed573"
        >
          <CardNumber color="#2ed573">2</CardNumber>
          <CardContent>
            <CardTitle color="#2ed573">The Solution</CardTitle>
            <CardText>
              Post-quantum cryptography uses mathematical problems that resist quantum attacks, ensuring security in the quantum era.
            </CardText>
          </CardContent>
        </Card>

        <Card
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          color="#3742fa"
        >
          <CardNumber color="#3742fa">3</CardNumber>
          <CardContent>
            <CardTitle color="#3742fa">Hybrid Approach</CardTitle>
            <CardText>
              Our system uses both RSA and Dilithium signatures, combining classical and quantum-resistant cryptography for maximum security.
            </CardText>
          </CardContent>
        </Card>
      </CardsContainer>

      <StartButton
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        onClick={handleStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Application
      </StartButton>
    </LandingContainer>
  );
};

export default LandingPage;
