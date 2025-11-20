package com.pqc.fido2.crypto;

import java.security.PrivateKey;
import java.util.List;

/**
 * Multi-layered Dilithium private key
 */
public class MLDilithiumPrivateKey implements PrivateKey {
    private final List<DilithiumPrivateKey> privateKeys;
    private final String algorithm = "ML-DILITHIUM";

    public MLDilithiumPrivateKey(List<DilithiumPrivateKey> privateKeys) {
        this.privateKeys = privateKeys;
    }

    @Override
    public String getAlgorithm() {
        return algorithm;
    }

    @Override
    public String getFormat() {
        return "RAW";
    }

    @Override
    public byte[] getEncoded() {
        // Concatenate all private key bytes
        int totalLength = privateKeys.stream()
            .mapToInt(key -> key.getKeyBytes().length)
            .sum();
        
        byte[] result = new byte[totalLength];
        int offset = 0;
        
        for (DilithiumPrivateKey key : privateKeys) {
            byte[] keyBytes = key.getKeyBytes();
            System.arraycopy(keyBytes, 0, result, offset, keyBytes.length);
            offset += keyBytes.length;
        }
        
        return result;
    }

    public DilithiumPrivateKey getLayerKey(int layer) {
        return privateKeys.get(layer);
    }

    public int getLayers() {
        return privateKeys.size();
    }

    public List<DilithiumPrivateKey> getAllKeys() {
        return privateKeys;
    }
}
