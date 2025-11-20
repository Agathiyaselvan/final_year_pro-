package com.pqc.fido2.crypto;

import java.security.PrivateKey;
import java.security.PublicKey;

/**
 * Represents a Dilithium key pair for post-quantum cryptography
 */
public class DilithiumKeyPair {
    private final DilithiumPublicKey publicKey;
    private final DilithiumPrivateKey privateKey;

    public DilithiumKeyPair(DilithiumPublicKey publicKey, DilithiumPrivateKey privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    public DilithiumPublicKey getPublicKey() {
        return publicKey;
    }

    public DilithiumPrivateKey getPrivateKey() {
        return privateKey;
    }
}
