package com.pqc.fido2.crypto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

/**
 * Multi-Layered Dilithium Signature Algorithm (ML-DSA) implementation
 * Provides enhanced security through multiple signature layers
 */
@Service
public class MLDilithiumService {
    
    @Autowired
    private DilithiumCryptoService dilithiumService;
    
    private final SecureRandom secureRandom = new SecureRandom();
    private final int DEFAULT_LAYERS = 3;

    /**
     * Generate a multi-layered Dilithium key pair
     */
    public MLDilithiumKeyPair generateMLKeyPair() {
        return generateMLKeyPair(DEFAULT_LAYERS);
    }

    /**
     * Generate a multi-layered Dilithium key pair with specified number of layers
     */
    public MLDilithiumKeyPair generateMLKeyPair(int layers) {
        List<DilithiumKeyPair> keyPairs = new ArrayList<>();
        
        for (int i = 0; i < layers; i++) {
            keyPairs.add(dilithiumService.generateKeyPair());
        }
        
        return new MLDilithiumKeyPair(keyPairs);
    }

    /**
     * Sign data with multi-layered Dilithium signatures
     */
    public MLDilithiumSignature signML(byte[] data, MLDilithiumPrivateKey privateKey) {
        List<DilithiumSignature> signatures = new ArrayList<>();
        byte[] currentData = data;
        
        // Create layered signatures
        for (int i = 0; i < privateKey.getLayers(); i++) {
            DilithiumPrivateKey layerKey = privateKey.getLayerKey(i);
            DilithiumSignature signature = dilithiumService.sign(currentData, layerKey);
            signatures.add(signature);
            
            // For next layer, sign the combination of data and current signature
            currentData = combineDataAndSignature(data, signature);
        }
        
        return new MLDilithiumSignature(signatures);
    }

    /**
     * Verify a multi-layered Dilithium signature
     */
    public boolean verifyML(byte[] data, MLDilithiumSignature signature, MLDilithiumPublicKey publicKey) {
        if (signature.getLayers() != publicKey.getLayers()) {
            return false;
        }
        
        byte[] currentData = data;
        
        // Verify each layer
        for (int i = 0; i < signature.getLayers(); i++) {
            DilithiumPublicKey layerKey = publicKey.getLayerKey(i);
            DilithiumSignature layerSignature = signature.getLayerSignature(i);
            
            if (!dilithiumService.verify(currentData, layerSignature, layerKey)) {
                return false;
            }
            
            // For next layer verification, combine data and current signature
            currentData = combineDataAndSignature(data, layerSignature);
        }
        
        return true;
    }

    /**
     * Create a hybrid signature combining classical and post-quantum cryptography
     */
    public HybridSignature createHybridSignature(byte[] data, MLDilithiumPrivateKey pqPrivateKey, 
                                               java.security.PrivateKey classicalPrivateKey) {
        // Generate post-quantum signature
        MLDilithiumSignature pqSignature = signML(data, pqPrivateKey);
        
        // Generate classical signature (simplified for demonstration)
        byte[] classicalSignature = generateClassicalSignature(data, classicalPrivateKey);
        
        return new HybridSignature(pqSignature, classicalSignature);
    }

    /**
     * Verify a hybrid signature
     */
    public boolean verifyHybridSignature(byte[] data, HybridSignature signature, 
                                       MLDilithiumPublicKey pqPublicKey, 
                                       java.security.PublicKey classicalPublicKey) {
        // Verify post-quantum signature
        boolean pqValid = verifyML(data, signature.getPqSignature(), pqPublicKey);
        
        // Verify classical signature
        boolean classicalValid = verifyClassicalSignature(data, signature.getClassicalSignature(), classicalPublicKey);
        
        return pqValid && classicalValid;
    }

    private byte[] combineDataAndSignature(byte[] data, DilithiumSignature signature) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(data);
            digest.update(signature.getSignatureBytes());
            return digest.digest();
        } catch (Exception e) {
            throw new RuntimeException("Error combining data and signature", e);
        }
    }

    private byte[] generateClassicalSignature(byte[] data, java.security.PrivateKey privateKey) {
        // Simplified classical signature generation
        // In a real implementation, this would use RSA or ECC
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(data);
            digest.update(privateKey.getEncoded());
            return digest.digest();
        } catch (Exception e) {
            throw new RuntimeException("Error generating classical signature", e);
        }
    }

    private boolean verifyClassicalSignature(byte[] data, byte[] signature, java.security.PublicKey publicKey) {
        // Simplified classical signature verification
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(data);
            digest.update(publicKey.getEncoded());
            byte[] expectedSignature = digest.digest();
            return MessageDigest.isEqual(signature, expectedSignature);
        } catch (Exception e) {
            return false;
        }
    }
}
