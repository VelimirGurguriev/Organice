package com.api.organice.auth;

import java.util.Optional;

import com.api.organice.users.User;
import com.api.organice.util.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

@Slf4j
public class SecurityUtil {
    private static final SecurityContextRepository securityContextRepository =
            new HttpSessionSecurityContextRepository();

    public static User getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user;
        }else {
            log.error("User requested but not found in SecurityContextHolder");
            throw ApiException.builder().status(401).message("Authentication required").build();
        }
    }

    public static Optional<User> getOptionalAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return Optional.of(user);
        } else {
            return Optional.empty();
        }
    }
}
