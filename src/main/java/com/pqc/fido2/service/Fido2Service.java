package com.pqc.fido2.service;

import com.pqc.fido2.crypto.*;
import com.pqc.fido2.dto.*;
import com.pqc.fido2.model.*;
import com.pqc.fido2.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class Fido2Service {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private DilithiumCryptoService dilithiumService;
    
    @Autowired
    private MLDilithiumService mlDilithiumService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CredentialRepository credentialRepository;
    
    @Autowired
    private AuthenticationSessionRepository sessionRepository;
    
    private final SecureRandom secureRandom = new SecureRandom();
    private final String RP_ID = "localhost";

    /**
     * Initiate user registration
     */
    public RegistrationResponse initiateRegistration(RegistrationRequest request) {
        // Create or get user
        User user = userService.findByUsername(request.getUsername())
            .orElseGet(() -> userService.createUser(
                request.getUsername(), 
                request.getEmail(), 
                request.getDisplayName()
            ));

        // Generate challenges
        String sessionId = UUID.randomUUID().toString();
        String challenge = generateChallenge();
        String pqChallenge = generateChallenge();

        // Create authentication session
        AuthenticationSession.AuthType authType = AuthenticationSession.AuthType.REGISTRATION;
        AuthenticationSession session = new AuthenticationSession(
            sessionId, challenge, pqChallenge, authType, user
        );
        sessionRepository.save(session);

        // Determine crypto type
        String cryptoType = request.getCryptoType() != null ? 
            request.getCryptoType() : "hybrid";

        // Encode user ID as base64url for WebAuthn
        String userId = Base64.getUrlEncoder().withoutPadding().encodeToString(
            user.getId().toString().getBytes()
        );
        
        return new RegistrationResponse(
            sessionId, challenge, pqChallenge, cryptoType, RP_ID, userId
        );
    }

    /**
     * Complete user registration with credential
     */
    public boolean completeRegistration(String sessionId, String credentialId, 
                                      String publicKey, String pqPublicKey, 
                                      String signature, String pqSignature) {
        Optional<AuthenticationSession> sessionOpt = sessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isEmpty() || sessionOpt.get().isUsed() || sessionOpt.get().isExpired()) {
            return false;
        }

        AuthenticationSession session = sessionOpt.get();
        User user = session.getUser();

        // Create credential
        Credential.CryptoType cryptoType = determineCryptoType(publicKey, pqPublicKey);
        Credential credential = new Credential(
            credentialId, publicKey, pqPublicKey, cryptoType, user
        );
        credentialRepository.save(credential);

        // Mark session as used
        session.setUsed(true);
        sessionRepository.save(session);

        return true;
    }

    /**
     * Initiate user authentication
     */
    public AuthenticationResponse initiateAuthentication(AuthenticationRequest request) {
        Optional<User> userOpt = userService.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        User user = userOpt.get();
        List<Credential> credentials = credentialRepository.findByUserAndIsActiveTrue(user);

        // Generate challenges
        String sessionId = UUID.randomUUID().toString();
        String challenge = generateChallenge();
        String pqChallenge = generateChallenge();

        // Create authentication session
        AuthenticationSession.AuthType authType = AuthenticationSession.AuthType.AUTHENTICATION;
        AuthenticationSession session = new AuthenticationSession(
            sessionId, challenge, pqChallenge, authType, user
        );
        sessionRepository.save(session);

        // Prepare allowed credentials
        Object[] allowCredentials = credentials.stream()
            .map(cred -> new Object() {
                public String type = "public-key";
                public String id = cred.getCredentialId();
            })
            .toArray();

        String cryptoType = request.getCryptoType() != null ? 
            request.getCryptoType() : "hybrid";

        return new AuthenticationResponse(
            sessionId, challenge, pqChallenge, cryptoType, RP_ID, allowCredentials
        );
    }

    /**
     * Complete user authentication
     */
    public boolean completeAuthentication(String sessionId, String credentialId, 
                                        String signature, String pqSignature) {
        Optional<AuthenticationSession> sessionOpt = sessionRepository.findBySessionId(sessionId);
        if (sessionOpt.isEmpty() || sessionOpt.get().isUsed() || sessionOpt.get().isExpired()) {
            return false;
        }

        Optional<Credential> credentialOpt = credentialRepository.findByCredentialId(credentialId);
        if (credentialOpt.isEmpty() || !credentialOpt.get().isActive()) {
            return false;
        }

        AuthenticationSession session = sessionOpt.get();
        Credential credential = credentialOpt.get();

        // Verify signature based on crypto type
        boolean isValid = verifySignature(session, credential, signature, pqSignature);
        
        if (isValid) {
            // Update credential usage
            credential.setSignatureCount(credential.getSignatureCount() + 1);
            credential.setLastUsed(LocalDateTime.now());
            credentialRepository.save(credential);

            // Update user last login
            userService.updateLastLogin(session.getUser());

            // Mark session as used
            session.setUsed(true);
            sessionRepository.save(session);
        }

        return isValid;
    }

    private String generateChallenge() {
        byte[] challenge = new byte[32];
        secureRandom.nextBytes(challenge);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(challenge);
    }

    private Credential.CryptoType determineCryptoType(String publicKey, String pqPublicKey) {
        if (publicKey != null && pqPublicKey != null) {
            return Credential.CryptoType.HYBRID;
        } else if (pqPublicKey != null) {
            return Credential.CryptoType.POST_QUANTUM;
        } else {
            return Credential.CryptoType.CLASSICAL;
        }
    }

    private boolean verifySignature(AuthenticationSession session, Credential credential, 
                                  String signature, String pqSignature) {
        try {
            byte[] challengeBytes = Base64.getUrlDecoder().decode(session.getChallenge());
            
            switch (credential.getCryptoType()) {
                case POST_QUANTUM:
                    return verifyPostQuantumSignature(challengeBytes, pqSignature, credential);
                case HYBRID:
                    return verifyHybridSignature(challengeBytes, signature, pqSignature, credential);
                case CLASSICAL:
                default:
                    return verifyClassicalSignature(challengeBytes, signature, credential);
            }
        } catch (Exception e) {
            return false;
        }
    }

    private boolean verifyPostQuantumSignature(byte[] data, String pqSignature, Credential credential) {
        // Implement post-quantum signature verification
        // This is a simplified implementation
        return pqSignature != null && !pqSignature.isEmpty();
    }

    private boolean verifyHybridSignature(byte[] data, String signature, String pqSignature, Credential credential) {
        // Implement hybrid signature verification
        // This is a simplified implementation
        return signature != null && !signature.isEmpty() && 
               pqSignature != null && !pqSignature.isEmpty();
    }

    private boolean verifyClassicalSignature(byte[] data, String signature, Credential credential) {
        // Implement classical signature verification
        // This is a simplified implementation
        return signature != null && !signature.isEmpty();
    }
}
