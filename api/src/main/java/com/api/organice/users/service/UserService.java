package com.api.organice.users.service;

import com.api.organice.users.User;
import com.api.organice.users.data.CreateUserRequest;
import com.api.organice.users.data.UserResponse;
import com.api.organice.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public UserResponse create(@Valid CreateUserRequest request) {
        User user = new User(request);
        user = userRepository.save(user);
        return new UserResponse(user);
    }
}
