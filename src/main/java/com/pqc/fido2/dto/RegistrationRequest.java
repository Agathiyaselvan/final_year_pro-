package com.pqc.fido2.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RegistrationRequest {
    @JsonProperty("username")
    private String username;

    @JsonProperty("email")
    private String email;

    @JsonProperty("displayName")
    private String displayName;

    @JsonProperty("cryptoType")
    private String cryptoType; // "classical", "post-quantum", "hybrid"

    // Constructors
    public RegistrationRequest() {}

    public RegistrationRequest(String username, String email, String displayName, String cryptoType) {
        this.username = username;
        this.email = email;
        this.displayName = displayName;
        this.cryptoType = cryptoType;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getCryptoType() {
        return cryptoType;
    }

    public void setCryptoType(String cryptoType) {
        this.cryptoType = cryptoType;
    }
}
