package com.api.organice.auth;

import com.api.organice.config.ApplicationProperties;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;


@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final ApplicationProperties applicationProperties;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(customizer -> {
            customizer
                    .requestMatchers(antMatcher(HttpMethod.POST, "/api/users")).permitAll()
                    .requestMatchers(antMatcher(HttpMethod.POST, "/api/auth/login")).permitAll()
                    .requestMatchers(antMatcher(HttpMethod.GET, "/api/users/verify-email")).permitAll()
                    .requestMatchers(antMatcher(HttpMethod.POST, "/api/users/forgot-password")).permitAll()
                    .requestMatchers(antMatcher(HttpMethod.PATCH, "/api/users/reset-password")).permitAll()
                    .anyRequest().authenticated();
        });

//        http.authorizeHttpRequests(customizer -> {
//            customizer
//                    .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
//                    .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
//                    .requestMatchers(HttpMethod.GET, "/api/users/verify-email").permitAll()
//                    .requestMatchers(HttpMethod.POST, "/api/users/forgot-password").permitAll()
//                    .requestMatchers(HttpMethod.PATCH, "/api/users/reset-password").permitAll()
//                    .anyRequest().authenticated();
//        });

        http.exceptionHandling(customizer -> {
            customizer.authenticationEntryPoint(
                    (request, response, authException) -> {
                        response.sendError(401, "Unauthorized");
//                response.setStatus(401); // Send 401 status
//                response.setContentType("application/json");
            });
        });

//        http.exceptionHandling(customizer -> {
//            customizer.authenticationEntryPoint(
//                    (request, response, authException) -> {
//                        String acceptHeader = request.getHeader(HttpHeaders.ACCEPT);
//                        if (acceptHeader != null && acceptHeader.contains("application/json")) {
//                            response.setStatus(401);
//                        } else {
//                            response.sendRedirect(applicationProperties.getLoginPageUrl());
//                        }
//                    });
//        });

        http.addFilterBefore(new UsernamePasswordAuthenticationFilter(), LogoutFilter.class);
        http.userDetailsService(userDetailsService);

        http.csrf(csrf -> {
            csrf.disable();
        });

        http.cors(customizer -> {
            customizer.configurationSource(corsConfigurationSource());
        });

//        http.sessionManagement(sessionManagement ->
//                sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(applicationProperties.getAllowedOrigins());
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);
                return config;
            }
        };
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(daoAuthenticationProvider);
    }
}
