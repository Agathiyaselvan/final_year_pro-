package com.pqc.fido2.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RegistrationResponse {
    @JsonProperty("sessionId")
    private String sessionId;

    @JsonProperty("challenge")
    private String challenge;

    @JsonProperty("pqChallenge")
    private String pqChallenge;

    @JsonProperty("cryptoType")
    private String cryptoType;

    @JsonProperty("rpId")
    private String rpId;

    @JsonProperty("userId")
    private String userId;

    // Constructors
    public RegistrationResponse() {}

    public RegistrationResponse(String sessionId, String challenge, String pqChallenge, 
                              String cryptoType, String rpId, String userId) {
        this.sessionId = sessionId;
        this.challenge = challenge;
        this.pqChallenge = pqChallenge;
        this.cryptoType = cryptoType;
        this.rpId = rpId;
        this.userId = userId;
    }

    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getChallenge() {
        return challenge;
    }

    public void setChallenge(String challenge) {
        this.challenge = challenge;
    }

    public String getPqChallenge() {
        return pqChallenge;
    }

    public void setPqChallenge(String pqChallenge) {
        this.pqChallenge = pqChallenge;
    }

    public String getCryptoType() {
        return cryptoType;
    }

    public void setCryptoType(String cryptoType) {
        this.cryptoType = cryptoType;
    }

    public String getRpId() {
        return rpId;
    }

    public void setRpId(String rpId) {
        this.rpId = rpId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
