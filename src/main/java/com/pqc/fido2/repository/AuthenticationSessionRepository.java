package com.pqc.fido2.repository;

import com.pqc.fido2.model.AuthenticationSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuthenticationSessionRepository extends JpaRepository<AuthenticationSession, Long> {
    Optional<AuthenticationSession> findBySessionId(String sessionId);
    List<AuthenticationSession> findByExpiresAtBeforeAndIsUsedFalse(LocalDateTime now);
    void deleteByExpiresAtBefore(LocalDateTime now);
}
