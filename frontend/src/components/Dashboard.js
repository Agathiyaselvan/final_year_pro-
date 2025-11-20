import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #000000;
  color: white;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
`;

const AppIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin-bottom: 1rem;
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  color: #ff4757;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #ff6b7a;
  }
`;

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Card = styled(motion.div)`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #333;
`;

const CardTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #667eea;
  font-weight: 600;
`;

const CardContent = styled.div`
  color: #cccccc;
  line-height: 1.6;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  margin: 1rem 0;
`;

const AccessButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    transform: translateY(-1px);
  }
`;

const KeyItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #2a2a2a;
  border-radius: 8px;
`;

const KeyIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: #ffa502;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 0.1rem;
`;

const KeyContent = styled.div`
  flex: 1;
`;

const KeyLabel = styled.div`
  color: #cccccc;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const KeyValue = styled.div`
  color: #888;
  font-size: 0.8rem;
  font-family: 'Courier New', monospace;
  word-break: break-all;
  line-height: 1.3;
`;

const SecurityDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #333;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SecurityLabel = styled.span`
  color: #cccccc;
  font-size: 0.9rem;
`;

const SecurityValue = styled.span`
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Dashboard = ({ user, onLogout }) => {
  const [protectedData, setProtectedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccessData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        user: user?.username || 'Bruce Wayne',
        rsaPublicKey: '308201a2300d06092a86................a5b46a96fb0203010001',
        dilithiumPublicKey: '308207b4300d060b2b06................1415b92b75bff1707472'
      };
      
      setProtectedData(mockData);
      toast.success('Protected data loaded successfully');
    } catch (error) {
      toast.error('Failed to load protected data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <div>
          <AppIcon>🛡️</AppIcon>
        </div>
        <LogoutButton onClick={onLogout}>
          Logout
        </LogoutButton>
      </Header>

      <Content>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CardTitle>Protected Data</CardTitle>
          <CardContent>
            {protectedData ? (
              <div>
                <KeyItem>
                  <KeyIcon>🔒</KeyIcon>
                  <KeyContent>
                    <KeyLabel>User: {protectedData.user}</KeyLabel>
                  </KeyContent>
                </KeyItem>
                
                <KeyItem>
                  <KeyIcon>🔑</KeyIcon>
                  <KeyContent>
                    <KeyLabel>RSA Public Key:</KeyLabel>
                    <KeyValue>{protectedData.rsaPublicKey}</KeyValue>
                  </KeyContent>
                </KeyItem>
                
                <KeyItem>
                  <KeyIcon>🔑</KeyIcon>
                  <KeyContent>
                    <KeyLabel>Dilithium Public Key:</KeyLabel>
                    <KeyValue>{protectedData.dilithiumPublicKey}</KeyValue>
                  </KeyContent>
                </KeyItem>
              </div>
            ) : (
              <EmptyState>No data fetched yet</EmptyState>
            )}
            
            <AccessButton
              onClick={handleAccessData}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Loading...' : 'Access Data'}
            </AccessButton>
          </CardContent>
        </Card>

        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CardTitle>Security Details</CardTitle>
          <CardContent>
            <SecurityDetail>
              <SecurityLabel>Hybrid Keys:</SecurityLabel>
              <SecurityValue>RSA + Dilithium-3</SecurityValue>
            </SecurityDetail>
            
            <SecurityDetail>
              <SecurityLabel>Key Size:</SecurityLabel>
              <SecurityValue>3072 | 4000(private key)</SecurityValue>
            </SecurityDetail>
            
            <SecurityDetail>
              <SecurityLabel>Claimed NIST Level Quantum Security:</SecurityLabel>
              <SecurityValue>Level 3</SecurityValue>
            </SecurityDetail>
            
            <SecurityDetail>
              <SecurityLabel>Session:</SecurityLabel>
              <SecurityValue>120 minutes</SecurityValue>
            </SecurityDetail>
          </CardContent>
        </Card>
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;