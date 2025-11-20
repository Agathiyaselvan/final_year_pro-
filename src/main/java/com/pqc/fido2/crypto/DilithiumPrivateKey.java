package com.pqc.fido2.crypto;

import java.security.PrivateKey;
import java.util.Arrays;

/**
 * Dilithium private key implementation
 */
public class DilithiumPrivateKey implements PrivateKey {
    private final byte[] keyBytes;
    private final String algorithm = "DILITHIUM";

    public DilithiumPrivateKey(byte[] keyBytes) {
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
        DilithiumPrivateKey that = (DilithiumPrivateKey) obj;
        return Arrays.equals(keyBytes, that.keyBytes);
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(keyBytes);
    }
}
