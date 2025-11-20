// Simple test to verify WebAuthn service works
import webAuthnService from '../services/webauthn';

describe('WebAuthn Service', () => {
  test('should handle base64url conversion correctly', () => {
    const testString = 'test-string';
    const encoded = webAuthnService.arrayBufferToBase64url(
      new TextEncoder().encode(testString).buffer
    );
    const decoded = new TextDecoder().decode(
      webAuthnService.base64urlToArrayBuffer(encoded)
    );
    expect(decoded).toBe(testString);
  });

  test('should handle malformed base64url gracefully', () => {
    expect(() => {
      webAuthnService.base64urlToArrayBuffer('invalid-base64!@#');
    }).toThrow('Invalid base64url encoding');
  });

  test('should detect WebAuthn support', () => {
    expect(typeof webAuthnService.isSupported).toBe('boolean');
  });
});
