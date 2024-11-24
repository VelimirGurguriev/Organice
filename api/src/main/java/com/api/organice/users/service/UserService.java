package com.api.organice.users.service;

import com.api.organice.users.User;
import com.api.organice.users.VerificationCode;
import com.api.organice.users.data.CreateUserRequest;
import com.api.organice.users.data.UserResponse;
import com.api.organice.users.jobs.SendWelcomeEmailJob;
import com.api.organice.users.repository.UserRepository;
import com.api.organice.users.repository.VerificationCodeRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;

    @Transactional
    public UserResponse create(@Valid CreateUserRequest request) {
        User user = new User(request);
        user = userRepository.save(user);
        sendVerificationEmail(user);
        return new UserResponse(user);
    }

    private void sendVerificationEmail(User user) {
        VerificationCode verificationCode = new VerificationCode(user);
        user.setVerificationCode(verificationCode);
        verificationCodeRepository.save(verificationCode);
        SendWelcomeEmailJob sendWelcomeEmailJob = new SendWelcomeEmailJob(user.getId());
        BackgroundJobRequest.enqueue(sendWelcomeEmailJob);
    }
}
