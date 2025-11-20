import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LogIn, Shield, Lock } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import webAuthnService from '../services/webauthn';
import {
  Container,
  Title,
  Subtitle,
  Form,
  FormGroup,
  Label,
  Input,
  Select,
  Button,
  Link as StyledLink,
  ErrorMessage,
  LoadingSpinner
} from './styled/Common';

const Login = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [cryptoType, setCryptoType] = useState('hybrid');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Begin authentication
      const authResponse = await authAPI.beginAuthentication({
        username: data.username,
        cryptoType: cryptoType
      });

      // Check if WebAuthn is supported
      if (!webAuthnService.isSupported) {
        toast.info('WebAuthn not supported - using demo mode for demonstration');
      }

      // Prepare WebAuthn options
      const publicKeyCredentialRequestOptions = {
        challenge: authResponse.challenge,
        allowCredentials: authResponse.allowCredentials || [],
        timeout: 60000,
        userVerification: 'preferred'
      };

      // Get assertion from authenticator
      const assertion = await webAuthnService.getAssertion(publicKeyCredentialRequestOptions);

      // Complete authentication
      const completeResponse = await authAPI.completeAuthentication({
        sessionId: authResponse.sessionId,
        credentialId: assertion.id,
        signature: assertion.response.signature,
        pqSignature: assertion.response.signature // Simplified for demo
      });

      if (completeResponse.status === 'success') {
        await login({
          username: data.username,
          cryptoType: cryptoType,
          lastLogin: new Date().toISOString()
        });
      } else {
        toast.error('Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setLoading(true);
    try {
      // Check if platform authenticator is available
      const isAvailable = await webAuthnService.isPlatformAuthenticatorAvailable();
      if (!isAvailable) {
        toast.error('Biometric authentication is not available on this device');
        setLoading(false);
        return;
      }

      // Use biometric authentication
      const data = { username: 'biometric_user', cryptoType: 'hybrid' };
      await onSubmit(data);
    } catch (error) {
      console.error('Biometric login error:', error);
      toast.error('Biometric authentication failed');
      setLoading(false);
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>
        <Shield size={32} style={{ marginRight: '0.5rem', display: 'inline' }} />
        Post-Quantum FIDO2
      </Title>
      <Subtitle>Secure passwordless authentication with quantum-resistant cryptography</Subtitle>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...register('username', { 
              required: 'Username is required',
              minLength: { value: 3, message: 'Username must be at least 3 characters' }
            })}
          />
          {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="cryptoType">Cryptography Type</Label>
          <Select
            id="cryptoType"
            value={cryptoType}
            onChange={(e) => setCryptoType(e.target.value)}
          >
            <option value="classical">Classical (RSA/ECC)</option>
            <option value="post-quantum">Post-Quantum (Dilithium)</option>
            <option value="hybrid">Hybrid (Classical + Post-Quantum)</option>
          </Select>
        </FormGroup>

        <Button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading && <LoadingSpinner />}
          <LogIn size={20} style={{ marginRight: '0.5rem' }} />
          {loading ? 'Authenticating...' : 'Login with FIDO2'}
        </Button>

        <Button
          type="button"
          onClick={handleBiometricLogin}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}
        >
          {loading && <LoadingSpinner />}
          <Lock size={20} style={{ marginRight: '0.5rem' }} />
          {loading ? 'Authenticating...' : 'Biometric Login'}
        </Button>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <StyledLink as={Link} to="/register">
            Register here
          </StyledLink>
        </p>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '10px' }}>
        <h4 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          🔐 Security Features:
        </h4>
        <ul style={{ color: '#718096', fontSize: '0.8rem', margin: 0, paddingLeft: '1rem' }}>
          <li>Quantum-resistant Dilithium signatures</li>
          <li>Multi-layered security architecture</li>
          <li>Biometric authentication support</li>
          <li>Hybrid classical/post-quantum cryptography</li>
        </ul>
      </div>
    </Container>
  );
};

export default Login;
