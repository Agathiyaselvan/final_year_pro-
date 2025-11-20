// Demo authentication service for browsers without WebAuthn support
class DemoAuthService {
  constructor() {
    this.isDemoMode = true;
  }

  // Generate a demo credential
  async createCredential(options) {
    console.log('Demo mode: Creating credential with options:', options);
    
    // Simulate WebAuthn credential creation
    const demoCredential = {
      id: 'demo-credential-' + Date.now(),
      rawId: btoa('demo-raw-id-' + Date.now()),
      response: {
        attestationObject: btoa('demo-attestation-object'),
        clientDataJSON: btoa(JSON.stringify({
          type: 'webauthn.create',
          challenge: options.challenge,
          origin: window.location.origin
        }))
      },
      type: 'public-key'
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(demoCredential);
      }, 1000); // Simulate async operation
    });
  }

  // Generate a demo assertion
  async getAssertion(options) {
    console.log('Demo mode: Getting assertion with options:', options);
    
    // Simulate WebAuthn assertion
    const demoAssertion = {
      id: 'demo-credential-' + Date.now(),
      rawId: btoa('demo-raw-id-' + Date.now()),
      response: {
        authenticatorData: btoa('demo-authenticator-data'),
        clientDataJSON: btoa(JSON.stringify({
          type: 'webauthn.get',
          challenge: options.challenge,
          origin: window.location.origin
        })),
        signature: btoa('demo-signature'),
        userHandle: null
      },
      type: 'public-key'
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(demoAssertion);
      }, 1000); // Simulate async operation
    });
  }

  // Check if platform authenticator is available (always true in demo mode)
  async isPlatformAuthenticatorAvailable() {
    return true;
  }

  // Get available transports (demo)
  async getAvailableTransports() {
    return ['internal', 'usb', 'nfc', 'ble'];
  }
}

export default new DemoAuthService();
