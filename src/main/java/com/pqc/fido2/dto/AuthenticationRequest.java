package com.pqc.fido2.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthenticationRequest {
    @JsonProperty("username")
    private String username;

    @JsonProperty("cryptoType")
    private String cryptoType;

    // Constructors
    public AuthenticationRequest() {}

    public AuthenticationRequest(String username, String cryptoType) {
        this.username = username;
        this.cryptoType = cryptoType;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCryptoType() {
        return cryptoType;
    }

    public void setCryptoType(String cryptoType) {
        this.cryptoType = cryptoType;
    }
}
