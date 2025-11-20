package com.pqc.fido2.crypto;

import java.util.List;

/**
 * Multi-layered Dilithium key pair
 */
public class MLDilithiumKeyPair {
    private final List<DilithiumKeyPair> keyPairs;

    public MLDilithiumKeyPair(List<DilithiumKeyPair> keyPairs) {
        this.keyPairs = keyPairs;
    }

    public MLDilithiumPublicKey getPublicKey() {
        return new MLDilithiumPublicKey(keyPairs.stream()
            .map(DilithiumKeyPair::getPublicKey)
            .toList());
    }

    public MLDilithiumPrivateKey getPrivateKey() {
        return new MLDilithiumPrivateKey(keyPairs.stream()
            .map(DilithiumKeyPair::getPrivateKey)
            .toList());
    }

    public int getLayers() {
        return keyPairs.size();
    }
}
