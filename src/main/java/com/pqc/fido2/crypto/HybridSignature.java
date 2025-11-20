package com.pqc.fido2.crypto;

/**
 * Hybrid signature combining classical and post-quantum cryptography
 */
public class HybridSignature {
    private final MLDilithiumSignature pqSignature;
    private final byte[] classicalSignature;

    public HybridSignature(MLDilithiumSignature pqSignature, byte[] classicalSignature) {
        this.pqSignature = pqSignature;
        this.classicalSignature = classicalSignature;
    }

    public MLDilithiumSignature getPqSignature() {
        return pqSignature;
    }

    public byte[] getClassicalSignature() {
        return classicalSignature;
    }
}
