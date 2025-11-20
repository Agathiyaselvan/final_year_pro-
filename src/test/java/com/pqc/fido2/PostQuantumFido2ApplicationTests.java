package com.pqc.fido2;

import com.pqc.fido2.crypto.DilithiumCryptoService;
import com.pqc.fido2.crypto.DilithiumKeyPair;
import com.pqc.fido2.crypto.DilithiumSignature;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PostQuantumFido2ApplicationTests {

    @Autowired
    private DilithiumCryptoService dilithiumService;

    @Test
    void contextLoads() {
        // Test that Spring context loads successfully
    }

    @Test
    void testDilithiumKeyGeneration() {
        // Test Dilithium key pair generation
        DilithiumKeyPair keyPair = dilithiumService.generateKeyPair();
        assertNotNull(keyPair);
        assertNotNull(keyPair.getPublicKey());
        assertNotNull(keyPair.getPrivateKey());
    }

    @Test
    void testDilithiumSigningAndVerification() {
        // Test signing and verification
        DilithiumKeyPair keyPair = dilithiumService.generateKeyPair();
        byte[] testData = "Hello, Post-Quantum World!".getBytes();
        
        // Sign the data
        DilithiumSignature signature = dilithiumService.sign(testData, keyPair.getPrivateKey());
        assertNotNull(signature);
        
        // Verify the signature
        boolean isValid = dilithiumService.verify(testData, signature, keyPair.getPublicKey());
        assertTrue(isValid);
    }

    @Test
    void testDilithiumSignatureTampering() {
        // Test that tampered signatures are rejected
        DilithiumKeyPair keyPair = dilithiumService.generateKeyPair();
        byte[] testData = "Hello, Post-Quantum World!".getBytes();
        
        // Sign the data
        DilithiumSignature signature = dilithiumService.sign(testData, keyPair.getPrivateKey());
        
        // Tamper with the data
        byte[] tamperedData = "Hello, Tampered World!".getBytes();
        
        // Verify with tampered data should fail
        boolean isValid = dilithiumService.verify(tamperedData, signature, keyPair.getPublicKey());
        assertFalse(isValid);
    }
}
