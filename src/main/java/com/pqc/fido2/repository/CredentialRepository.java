package com.pqc.fido2.repository;

import com.pqc.fido2.model.Credential;
import com.pqc.fido2.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CredentialRepository extends JpaRepository<Credential, Long> {
    Optional<Credential> findByCredentialId(String credentialId);
    List<Credential> findByUserAndIsActiveTrue(User user);
    List<Credential> findByUserAndCryptoTypeAndIsActiveTrue(User user, Credential.CryptoType cryptoType);
    boolean existsByCredentialId(String credentialId);
}
