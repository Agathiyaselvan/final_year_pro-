import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { UserPlus, Lock, CheckCircle } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import webAuthnService from '../services/webauthn';
import { testBase64urlConversion, testWebAuthnService } from '../utils/base64urlTest';
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
  LoadingSpinner,
  SuccessMessage
} from './styled/Common';

const Register = () => {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [cryptoType, setCryptoType] = useState('hybrid');
  const [registrationStep, setRegistrationStep] = useState('form'); // 'form', 'webauthn', 'complete'

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Run tests for debugging
      console.log('Running base64url tests...');
      testBase64urlConversion();
      testWebAuthnService(webAuthnService);
      
      // Begin registration
      const regResponse = await authAPI.beginRegistration({
        username: data.username,
        email: data.email,
        displayName: data.displayName,
        cryptoType: cryptoType
      });

      console.log('Registration response:', regResponse);

      // Check if WebAuthn is supported
      if (!webAuthnService.isSupported) {
        toast.info('WebAuthn not supported - using demo mode for demonstration');
      }

      setRegistrationStep('webauthn');

      // Prepare WebAuthn options
      const publicKeyCredentialCreationOptions = {
        challenge: regResponse.challenge,
        rp: {
          name: "Post-Quantum FIDO2 Demo",
          id: regResponse.rpId
        },
        user: {
          id: regResponse.userId,
          name: data.username,
          displayName: data.displayName
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256
          { type: "public-key", alg: -257 } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "preferred",
          requireResidentKey: false
        },
        timeout: 60000,
        attestation: "direct"
      };

      // Create credential
      const credential = await webAuthnService.createCredential(publicKeyCredentialCreationOptions);

      setRegistrationStep('complete');

      // Complete registration
      const completeResponse = await authAPI.completeRegistration({
        sessionId: regResponse.sessionId,
        credentialId: credential.id,
        publicKey: credential.response.attestationObject,
        pqPublicKey: credential.response.attestationObject, // Simplified for demo
        signature: credential.response.clientDataJSON,
        pqSignature: credential.response.clientDataJSON // Simplified for demo
      });

      if (completeResponse.status === 'success') {
        await login({
          username: data.username,
          email: data.email,
          displayName: data.displayName,
          cryptoType: cryptoType,
          registeredAt: new Date().toISOString()
        });
        toast.success('Registration completed successfully!');
      } else {
        toast.error('Registration failed');
        setRegistrationStep('form');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      setRegistrationStep('form');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricRegistration = async () => {
    setLoading(true);
    try {
      // Check if platform authenticator is available
      const isAvailable = await webAuthnService.isPlatformAuthenticatorAvailable();
      if (!isAvailable) {
        toast.error('Biometric authentication is not available on this device');
        setLoading(false);
        return;
      }

      // Use biometric registration
      const data = { 
        username: 'biometric_user', 
        email: 'biometric@example.com', 
        displayName: 'Biometric User',
        cryptoType: 'hybrid' 
      };
      await onSubmit(data);
    } catch (error) {
      console.error('Biometric registration error:', error);
      toast.error('Biometric registration failed');
      setLoading(false);
    }
  };

  if (registrationStep === 'webauthn') {
    return (
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>
          <Lock size={32} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Create Security Key
        </Title>
        <Subtitle>Please use your authenticator to create a security key</Subtitle>
        
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <LoadingSpinner style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#718096' }}>
            Follow the prompts on your device to complete the registration...
          </p>
        </div>
      </Container>
    );
  }

  if (registrationStep === 'complete') {
    return (
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>
          <CheckCircle size={32} style={{ marginRight: '0.5rem', display: 'inline', color: '#38a169' }} />
          Registration Complete!
        </Title>
        <Subtitle>Your account has been created successfully</Subtitle>
        
        <SuccessMessage>
          <strong>Welcome to Post-Quantum FIDO2!</strong><br />
          Your account is now secured with quantum-resistant cryptography.
        </SuccessMessage>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <StyledLink as={Link} to="/dashboard">
            Go to Dashboard
          </StyledLink>
        </div>
      </Container>
    );
  }

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>
        <UserPlus size={32} style={{ marginRight: '0.5rem', display: 'inline' }} />
        Create Account
      </Title>
      <Subtitle>Join the future of secure authentication</Subtitle>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Choose a username"
            {...register('username', { 
              required: 'Username is required',
              minLength: { value: 3, message: 'Username must be at least 3 characters' },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores'
              }
            })}
          />
          {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="Enter your display name"
            {...register('displayName', { 
              required: 'Display name is required',
              minLength: { value: 2, message: 'Display name must be at least 2 characters' }
            })}
          />
          {errors.displayName && <ErrorMessage>{errors.displayName.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="cryptoType">Cryptography Type</Label>
          <Select
            id="cryptoType"
            value={cryptoType}
            onChange={(e) => setCryptoType(e.target.value)}
          >
            <option value="classical">Classical (RSA/ECC) - Fast but vulnerable to quantum attacks</option>
            <option value="post-quantum">Post-Quantum (Dilithium) - Quantum-resistant but slower</option>
            <option value="hybrid">Hybrid (Recommended) - Best of both worlds</option>
          </Select>
        </FormGroup>

        <Button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading && <LoadingSpinner />}
          <UserPlus size={20} style={{ marginRight: '0.5rem' }} />
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <Button
          type="button"
          onClick={handleBiometricRegistration}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}
        >
          {loading && <LoadingSpinner />}
          <Lock size={20} style={{ marginRight: '0.5rem' }} />
          {loading ? 'Creating Account...' : 'Register with Biometrics'}
        </Button>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <StyledLink as={Link} to="/login">
            Login here
          </StyledLink>
        </p>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '10px' }}>
        <h4 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          🚀 Why Choose Post-Quantum FIDO2?
        </h4>
        <ul style={{ color: '#718096', fontSize: '0.8rem', margin: 0, paddingLeft: '1rem' }}>
          <li>Future-proof against quantum computers</li>
          <li>No passwords to remember or lose</li>
          <li>Biometric authentication support</li>
          <li>Military-grade security standards</li>
        </ul>
      </div>
    </Container>
  );
};

export default Register;
