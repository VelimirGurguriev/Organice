package com.api.organice.auth.service;

import com.api.organice.auth.SecurityUtil;
import com.api.organice.auth.data.LoginRequest;
import com.api.organice.users.User;
import com.api.organice.users.data.UserResponse;
import com.api.organice.users.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Collection;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
    SecurityContextLogoutHandler logoutHandler = new SecurityContextLogoutHandler();

    public void login(HttpServletRequest request,
                      HttpServletResponse response,
                      @Valid LoginRequest body
    ) throws AuthenticationException {
        UsernamePasswordAuthenticationToken token = UsernamePasswordAuthenticationToken.unauthenticated(body.getEmail(), body.getPassword());
        Authentication authentication = authenticationManager.authenticate(token);
        SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();
        SecurityContext context = securityContextHolderStrategy.createEmptyContext();
        context.setAuthentication(authentication);
        securityContextHolderStrategy.setContext(context);
        securityContextRepository.saveContext(context, request, response);
    }

    @Transactional
    public UserResponse getSession(HttpServletRequest request) {
        User user = SecurityUtil.getAuthenticatedUser();
        user = userRepository.getOne(user.getId());
        return new UserResponse(user);
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        this.logoutHandler.logout(request, response, authentication);
    }
}