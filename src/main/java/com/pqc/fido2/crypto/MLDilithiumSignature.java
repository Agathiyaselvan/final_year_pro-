package com.pqc.fido2.crypto;

import java.util.List;

/**
 * Multi-layered Dilithium signature
 */
public class MLDilithiumSignature {
    private final List<DilithiumSignature> signatures;

    public MLDilithiumSignature(List<DilithiumSignature> signatures) {
        this.signatures = signatures;
    }

    public DilithiumSignature getLayerSignature(int layer) {
        return signatures.get(layer);
    }

    public int getLayers() {
        return signatures.size();
    }

    public List<DilithiumSignature> getAllSignatures() {
        return signatures;
    }
}
