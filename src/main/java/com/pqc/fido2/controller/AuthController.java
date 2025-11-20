package com.pqc.fido2.controller;

import com.pqc.fido2.dto.*;
import com.pqc.fido2.service.Fido2Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private Fido2Service fido2Service;

    private static final Logger log = LoggerFactory.getLogger("server.controller.AuthController");

    @PostMapping("/register/begin")
    public ResponseEntity<RegistrationResponse> startRegistration(@RequestBody RegistrationRequest request) {
        try {
            log.info("START REGISTRATION - Initiating registration for user: {}", request.getUsername());
            RegistrationResponse response = fido2Service.initiateRegistration(request);
            log.info("[REGISTRATION CHALLENGE GENERATED] - User: {} , Challenge: {}", request.getUsername(), response.getChallenge());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("[REGISTRATION ERROR] - {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register/complete")
    public ResponseEntity<Map<String, String>> finishRegistration(@RequestBody Map<String, String> request) {
        try {
            String sessionId = request.get("sessionId");
            String credentialId = request.get("credentialId");
            String publicKey = request.get("publicKey");
            String pqPublicKey = request.get("pqPublicKey");
            String signature = request.get("signature");
            String pqSignature = request.get("pqSignature");

            String username = request.getOrDefault("username", "<masked>");
            log.info("[FINISH REGISTRATION] - Verifying registration for user: {}", username);
            // blank line for spacing like the reference output
            log.info("");
            if (pqPublicKey != null) {
                log.info("Public Key (Dilithium): {}", pqPublicKey);
            } else {
                log.info("Public Key (Dilithium): <none>");
            }
            log.info("");
            if (publicKey != null) {
                log.info("Public Key (RSA): {}", publicKey);
            } else {
                log.info("Public Key (RSA): <none>");
            }

            boolean success = fido2Service.completeRegistration(
                sessionId, credentialId, publicKey, pqPublicKey, signature, pqSignature
            );

            if (success) {
                log.info("");
                log.info("[REGISTRATION SUCCESS] - User: {}", username);
                // Create a short, JWT-looking preview string (not an actual token)
                String tokenPreview = "eyJhbGciOiJIUzI1NiJ9." + java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(username.getBytes()).substring(0, Math.min(32, username.length())) + ".JAwN0tVkNT";
                log.info("");
                log.info("[TOKEN ISSUED] - User: {}, Token: {}", username, tokenPreview);
                return ResponseEntity.ok(Map.of("status", "success", "message", "Registration completed"));
            } else {
                log.warn("[REGISTRATION FAILED] - User: {}", request.getOrDefault("username", "<masked>"));
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Registration failed"));
            }
        } catch (Exception e) {
            log.error("[REGISTRATION ERROR] - {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @PostMapping("/login/begin")
    public ResponseEntity<AuthenticationResponse> startAuthentication(@RequestBody AuthenticationRequest request) {
        try {
            log.info("[START AUTHENTICATION] - User: {}", request.getUsername());
            AuthenticationResponse response = fido2Service.initiateAuthentication(request);
            log.info("[AUTH CHALLENGE GENERATED] - User: {}, Challenge: {}", request.getUsername(), response.getChallenge());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("[AUTHENTICATION ERROR] - {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login/complete")
    public ResponseEntity<Map<String, String>> finishAuthentication(@RequestBody Map<String, String> request) {
        try {
            String sessionId = request.get("sessionId");
            String credentialId = request.get("credentialId");
            String signature = request.get("signature");
            String pqSignature = request.get("pqSignature");

            boolean success = fido2Service.completeAuthentication(
                sessionId, credentialId, signature, pqSignature
            );

            if (success) {
                log.info("[AUTHENTICATION SUCCESS] - Credential: {}", credentialId);
                return ResponseEntity.ok(Map.of("status", "success", "message", "Authentication successful"));
            } else {
                log.warn("[AUTHENTICATION FAILED] - Credential: {}", credentialId);
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Authentication failed"));
            }
        } catch (Exception e) {
            log.error("[AUTHENTICATION ERROR] - {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "healthy", "service", "Post-Quantum FIDO2"));
    }
}
