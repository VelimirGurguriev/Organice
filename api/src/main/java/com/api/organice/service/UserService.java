package com.api.organice.service;

import com.api.organice.module.AppUser;
import com.api.organice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<AppUser> user = userRepository.findByUsername(username);

        if (user.isPresent()) {

            var newUser = user.get();
            return User.builder()
                    .username(newUser.getUsername())
                    .password(newUser.getPassword())
                    .build();
        } else {
            throw new UsernameNotFoundException(username);
        }
    }
}
