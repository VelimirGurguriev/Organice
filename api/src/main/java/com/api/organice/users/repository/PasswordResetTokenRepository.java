package com.api.organice.users.repository;

import java.util.Optional;

import com.api.organice.users.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    @Query("SELECT prt FROM PasswordResetToken prt WHERE prt.token = ?1")
    Optional<PasswordResetToken> findByToken(String passwordResetToken);
}