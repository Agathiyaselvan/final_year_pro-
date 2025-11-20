package com.pqc.fido2.crypto;

import java.util.Arrays;

/**
 * Represents a Dilithium digital signature
 */
public class DilithiumSignature {
    private final byte[] signatureBytes;
    private final String algorithm = "DILITHIUM";

    public DilithiumSignature(byte[] signatureBytes) {
        this.signatureBytes = Arrays.copyOf(signatureBytes, signatureBytes.length);
    }

    public byte[] getSignatureBytes() {
        return Arrays.copyOf(signatureBytes, signatureBytes.length);
    }

    public String getAlgorithm() {
        return algorithm;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        DilithiumSignature that = (DilithiumSignature) obj;
        return Arrays.equals(signatureBytes, that.signatureBytes);
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(signatureBytes);
    }
}
