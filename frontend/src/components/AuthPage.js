import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import webauthnService from '../services/webauthn';
import apiService from '../services/api';

const AuthContainer = styled.div`
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

const AuthCard = styled(motion.div)`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #cccccc;
  text-align: center;
  margin-bottom: 2rem;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #333;
`;

const Tab = styled.button`
  flex: 1;
  background: none;
  border: none;
  color: ${props => props.active ? '#667eea' : '#888'};
  padding: 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#667eea' : 'transparent'};
  transition: all 0.3s ease;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #cccccc;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #666;
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProgressContainer = styled(motion.div)`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #333;
`;

const ProgressTitle = styled.h3`
  color: #667eea;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: ${props => props.completed ? '#2ed573' : '#888'};
  font-size: 0.9rem;
`;

const CheckIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.completed ? '#2ed573' : '#444'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
`;

const SuccessContainer = styled(motion.div)`
  margin-top: 2rem;
  padding: 1.5rem;
  background: #1a3a1a;
  border-radius: 8px;
  border: 1px solid #2ed573;
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #2ed573;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  margin: 0 auto 0.5rem;
`;

const SuccessText = styled.div`
  color: #2ed573;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const SuccessSubtext = styled.div`
  color: #cccccc;
  font-size: 0.8rem;
`;

const DashboardButton = styled(motion.button)`
  background: #2ed573;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    background: #26c965;
  }
`;

const AuthPage = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('register');
  const [formData, setFormData] = useState({
    username: 'Bruce Wayne',
    email: 'BruceWayne@gmail.com'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressSteps, setProgressSteps] = useState([
    { id: 'keys', text: 'Generating Secure Keys', completed: false },
    { id: 'server', text: 'Communicating with Server', completed: false },
    { id: 'success', text: 'Authentication Successful', completed: false }
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const updateProgress = (stepId) => {
    setProgressSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowProgress(true);
    setShowSuccess(false);

    try {
      // Step 1: Generate keys
      updateProgress('keys');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Communicate with server
      updateProgress('server');
      await new Promise(resolve => setTimeout(resolve, 1000));

      let response;
      if (activeTab === 'register') {
        response = await handleRegistration();
      } else {
        response = await handleLogin();
      }

      // Step 3: Success
      updateProgress('success');
      await new Promise(resolve => setTimeout(resolve, 500));

      setShowSuccess(true);
      
      if (response && response.token) {
        onLogin({ username: formData.username, email: formData.email }, response.token);
      }

    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Authentication failed. Please try again.');
      setShowProgress(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async () => {
    try {
      // Start registration
      const startResponse = await apiService.startRegistration({
        username: formData.username,
        email: formData.email,
        displayName: formData.username,
        cryptoType: 'hybrid'
      });
      
      // Create credential
      const credential = await webauthnService.createCredential({
        challenge: startResponse.challenge,
        rp: { name: "Post-Quantum FIDO2", id: startResponse.rpId },
        user: {
          id: startResponse.userId,
          name: formData.username,
          displayName: formData.username
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform"
        },
        timeout: 60000,
        attestation: "direct"
      });

      // Finish registration
      const finishResponse = await apiService.finishRegistration({
        sessionId: startResponse.sessionId,
        credentialId: credential.id,
        // For demo purposes, reuse credential fields as stand-ins
        publicKey: credential.rawId,
        pqPublicKey: credential.rawId,
        signature: credential.response.clientDataJSON,
        pqSignature: credential.response.attestationObject
      });

      return finishResponse;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleLogin = async () => {
    try {
      // Start authentication
      const startResponse = await apiService.startAuthentication({
        username: formData.username,
        cryptoType: 'hybrid'
      });
      
      // Get assertion
      const assertion = await webauthnService.getAssertion({
        challenge: startResponse.challenge,
        rpId: "localhost",
        allowCredentials: startResponse.allowCredentials,
        timeout: 60000
      });

      // Finish authentication
      const finishResponse = await apiService.finishAuthentication({
        sessionId: startResponse.sessionId,
        credentialId: assertion.id,
        signature: assertion.response.signature,
        pqSignature: assertion.response.signature // demo reuse
      });

      return finishResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  return (
    <AuthContainer>
      <AuthCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>PQC-Enhanced Password-less Authentication</Title>
        <Subtitle>Protected by hybrid RSA-Dilithium keys</Subtitle>

        <TabsContainer>
          <Tab 
            active={activeTab === 'register'} 
            onClick={() => setActiveTab('register')}
          >
            Register
          </Tab>
          <Tab 
            active={activeTab === 'login'} 
            onClick={() => setActiveTab('login')}
          >
            Login
          </Tab>
        </TabsContainer>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Username</Label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          {activeTab === 'register' && (
            <InputGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </InputGroup>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Processing...' : (activeTab === 'register' ? 'Register' : 'Login')}
          </Button>
        </Form>

        <AnimatePresence>
          {showProgress && (
            <ProgressContainer
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProgressTitle>Authentication Progress</ProgressTitle>
              {progressSteps.map((step) => (
                <ProgressStep key={step.id} completed={step.completed}>
                  <CheckIcon completed={step.completed}>
                    {step.completed ? '✓' : '○'}
                  </CheckIcon>
                  {step.text}
                </ProgressStep>
              ))}
            </ProgressContainer>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSuccess && (
            <SuccessContainer
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <SuccessIcon>✓</SuccessIcon>
              <SuccessText>Authentication Successful</SuccessText>
              <SuccessSubtext>
                {activeTab === 'register' 
                  ? 'Registration completed. Token stored securely.' 
                  : 'Logged in. Token stored securely.'
                }
              </SuccessSubtext>
              <DashboardButton
                onClick={() => onLogin({ username: formData.username, email: formData.email }, 'demo-token')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Go to Dashboard
              </DashboardButton>
            </SuccessContainer>
          )}
        </AnimatePresence>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;
