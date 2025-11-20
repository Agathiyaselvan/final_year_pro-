import demoAuth from './demoAuth';

// WebAuthn service for FIDO2 integration
class WebAuthnService {
  constructor() {
    this.isSupported = this.checkSupport();
    this.demoMode = !this.isSupported;
  }

  checkSupport() {
    return !!(navigator.credentials && window.PublicKeyCredential);
  }

  // Convert base64url to ArrayBuffer
  base64urlToArrayBuffer(base64url) {
    try {
      if (!base64url || typeof base64url !== 'string') {
        throw new Error('Invalid input: not a string');
      }
      
      // Add padding if needed
      let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      
      console.log('Converting base64url:', base64url.substring(0, 20) + '...');
      console.log('Padded base64:', base64.substring(0, 20) + '...');
      
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error) {
      console.error('Error converting base64url to ArrayBuffer:', error);
      console.error('Input was:', base64url);
      throw new Error('Invalid base64url encoding: ' + error.message);
    }
  }

  // Convert ArrayBuffer to base64url
  arrayBufferToBase64url(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  // Create credential for registration
  async createCredential(publicKeyCredentialCreationOptions) {
    if (this.demoMode) {
      console.log('WebAuthn not supported, using demo mode');
      return await demoAuth.createCredential(publicKeyCredentialCreationOptions);
    }

    try {
      // Validate required fields
      if (!publicKeyCredentialCreationOptions.challenge) {
        throw new Error('Missing challenge in registration options');
      }
      if (!publicKeyCredentialCreationOptions.user || !publicKeyCredentialCreationOptions.user.id) {
        throw new Error('Missing user ID in registration options');
      }
      
      console.log('Registration options:', {
        challenge: publicKeyCredentialCreationOptions.challenge.substring(0, 20) + '...',
        userId: publicKeyCredentialCreationOptions.user.id.substring(0, 20) + '...',
        username: publicKeyCredentialCreationOptions.user.name
      });
      
      // Convert base64url strings to ArrayBuffers
      const challenge = this.base64urlToArrayBuffer(publicKeyCredentialCreationOptions.challenge);
      
      const publicKey = {
        ...publicKeyCredentialCreationOptions,
        challenge,
        user: {
          ...publicKeyCredentialCreationOptions.user,
          id: this.base64urlToArrayBuffer(publicKeyCredentialCreationOptions.user.id)
        }
      };

      // Add allowCredentials if present
      if (publicKeyCredentialCreationOptions.allowCredentials) {
        publicKey.allowCredentials = publicKeyCredentialCreationOptions.allowCredentials.map(cred => ({
          ...cred,
          id: this.base64urlToArrayBuffer(cred.id)
        }));
      }

      const credential = await navigator.credentials.create({
        publicKey
      });

      return {
        id: credential.id,
        rawId: this.arrayBufferToBase64url(credential.rawId),
        response: {
          attestationObject: this.arrayBufferToBase64url(credential.response.attestationObject),
          clientDataJSON: this.arrayBufferToBase64url(credential.response.clientDataJSON)
        },
        type: credential.type
      };
    } catch (error) {
      console.error('Error creating credential:', error);
      if (error.name === 'NotSupportedError') {
        throw new Error('WebAuthn is not supported on this device');
      } else if (error.name === 'NotAllowedError') {
        throw new Error('User cancelled the operation or no authenticator was available');
      } else if (error.name === 'InvalidStateError') {
        throw new Error('The authenticator was already registered');
      } else {
        throw new Error('Failed to create credential: ' + error.message);
      }
    }
  }

  // Get assertion for authentication
  async getAssertion(publicKeyCredentialRequestOptions) {
    if (this.demoMode) {
      console.log('WebAuthn not supported, using demo mode');
      return await demoAuth.getAssertion(publicKeyCredentialRequestOptions);
    }

    try {
      // Convert base64url strings to ArrayBuffers
      const challenge = this.base64urlToArrayBuffer(publicKeyCredentialRequestOptions.challenge);
      
      const publicKey = {
        ...publicKeyCredentialRequestOptions,
        challenge
      };

      // Add allowCredentials if present
      if (publicKeyCredentialRequestOptions.allowCredentials) {
        publicKey.allowCredentials = publicKeyCredentialRequestOptions.allowCredentials.map(cred => ({
          ...cred,
          id: this.base64urlToArrayBuffer(cred.id)
        }));
      }

      const assertion = await navigator.credentials.get({
        publicKey
      });

      return {
        id: assertion.id,
        rawId: this.arrayBufferToBase64url(assertion.rawId),
        response: {
          authenticatorData: this.arrayBufferToBase64url(assertion.response.authenticatorData),
          clientDataJSON: this.arrayBufferToBase64url(assertion.response.clientDataJSON),
          signature: this.arrayBufferToBase64url(assertion.response.signature),
          userHandle: assertion.response.userHandle ? 
            this.arrayBufferToBase64url(assertion.response.userHandle) : null
        },
        type: assertion.type
      };
    } catch (error) {
      console.error('Error getting assertion:', error);
      if (error.name === 'NotSupportedError') {
        throw new Error('WebAuthn is not supported on this device');
      } else if (error.name === 'NotAllowedError') {
        throw new Error('User cancelled the operation or no authenticator was available');
      } else if (error.name === 'InvalidStateError') {
        throw new Error('The authenticator is not registered');
      } else {
        throw new Error('Failed to get assertion: ' + error.message);
      }
    }
  }

  // Check if platform authenticator is available
  async isPlatformAuthenticatorAvailable() {
    if (this.demoMode) {
      return await demoAuth.isPlatformAuthenticatorAvailable();
    }

    try {
      const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (error) {
      console.error('Error checking platform authenticator:', error);
      return false;
    }
  }

  // Get available authenticator transports
  async getAvailableTransports() {
    if (this.demoMode) {
      return await demoAuth.getAvailableTransports();
    }

    try {
      const transports = await window.PublicKeyCredential.getTransports();
      return transports;
    } catch (error) {
      console.error('Error getting transports:', error);
      return [];
    }
  }
}

const webAuthnService = new WebAuthnService();
export default webAuthnService;
