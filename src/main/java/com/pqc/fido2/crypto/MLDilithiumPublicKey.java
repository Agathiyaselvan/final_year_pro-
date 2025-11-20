package com.pqc.fido2.crypto;

import java.security.PublicKey;
import java.util.List;

/**
 * Multi-layered Dilithium public key
 */
public class MLDilithiumPublicKey implements PublicKey {
    private final List<DilithiumPublicKey> publicKeys;
    private final String algorithm = "ML-DILITHIUM";

    public MLDilithiumPublicKey(List<DilithiumPublicKey> publicKeys) {
        this.publicKeys = publicKeys;
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
        // Concatenate all public key bytes
        int totalLength = publicKeys.stream()
            .mapToInt(key -> key.getKeyBytes().length)
            .sum();
        
        byte[] result = new byte[totalLength];
        int offset = 0;
        
        for (DilithiumPublicKey key : publicKeys) {
            byte[] keyBytes = key.getKeyBytes();
            System.arraycopy(keyBytes, 0, result, offset, keyBytes.length);
            offset += keyBytes.length;
        }
        
        return result;
    }

    public DilithiumPublicKey getLayerKey(int layer) {
        return publicKeys.get(layer);
    }

    public int getLayers() {
        return publicKeys.size();
    }

    public List<DilithiumPublicKey> getAllKeys() {
        return publicKeys;
    }
}
