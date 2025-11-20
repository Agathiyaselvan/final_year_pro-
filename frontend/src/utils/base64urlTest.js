// Test utility for base64url conversion
export function testBase64urlConversion() {
  const testCases = [
    'test-string',
    'aGVsbG8gd29ybGQ', // "hello world" in base64
    'dGVzdC1zdHJpbmc', // "test-string" in base64
    'YWJjZGVmZ2hpams', // "abcdefghijk" in base64
  ];

  console.log('Testing base64url conversion...');
  
  testCases.forEach((testCase, index) => {
    try {
      // Test encoding
      const encoded = btoa(testCase).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      console.log(`Test ${index + 1}: Original="${testCase}", Encoded="${encoded}"`);
      
      // Test decoding
      let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const decoded = atob(base64);
      console.log(`Test ${index + 1}: Decoded="${decoded}", Match=${testCase === decoded}`);
    } catch (error) {
      console.error(`Test ${index + 1} failed:`, error);
    }
  });
}

// Test WebAuthn service
export function testWebAuthnService(webAuthnService) {
  console.log('Testing WebAuthn service...');
  
  const testString = 'test-user-id-123';
  const encoded = webAuthnService.arrayBufferToBase64url(
    new TextEncoder().encode(testString).buffer
  );
  console.log('Encoded:', encoded);
  
  try {
    const decoded = new TextDecoder().decode(
      webAuthnService.base64urlToArrayBuffer(encoded)
    );
    console.log('Decoded:', decoded);
    console.log('Match:', testString === decoded);
  } catch (error) {
    console.error('Decoding failed:', error);
  }
}
