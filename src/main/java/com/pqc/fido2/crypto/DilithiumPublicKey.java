package com.pqc.fido2.crypto;

import java.security.PublicKey;
import java.util.Arrays;

/**
 * Dilithium public key implementation
 */
public class DilithiumPublicKey implements PublicKey {
    private final byte[] keyBytes;
    private final String algorithm = "DILITHIUM";

    public DilithiumPublicKey(byte[] keyBytes) {
        this.keyBytes = Arrays.copyOf(keyBytes, keyBytes.length);
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
        return Arrays.copyOf(keyBytes, keyBytes.length);
    }

    public byte[] getKeyBytes() {
        return Arrays.copyOf(keyBytes, keyBytes.length);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        DilithiumPublicKey that = (DilithiumPublicKey) obj;
        return Arrays.equals(keyBytes, that.keyBytes);
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(keyBytes);
    }
}
