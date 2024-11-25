package com.api.organice.users.jobs.handlers;

import com.api.organice.config.ApplicationProperties;
import com.api.organice.email.EmailService;
import com.api.organice.users.User;
import com.api.organice.users.VerificationCode;
import com.api.organice.users.jobs.SendWelcomeEmailJob;
import com.api.organice.users.repository.UserRepository;
import com.api.organice.users.repository.VerificationCodeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class SendWelcomeEmailJobHandler implements JobRequestHandler<SendWelcomeEmailJob> {

    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final SpringTemplateEngine templateEngine;
    private final EmailService emailService;
    private final ApplicationProperties applicationProperties;

    @Override
    @Transactional
    public void run(SendWelcomeEmailJob sendWelcomeEmailJob) throws Exception {
        User user = userRepository.findById(sendWelcomeEmailJob.getUserId()).orElseThrow(() ->
                new RuntimeException("User not found"));
        log.info("Sending welcome email to user with id: {}" + sendWelcomeEmailJob.getUserId());
        if (user.getVerificationCode() != null && !user.getVerificationCode().isEmailSent()) {
            sendWelcomeEmail(user, user.getVerificationCode());
        }
    }

    private void sendWelcomeEmail(User user, VerificationCode verificationCode) {
        String verificationLink = applicationProperties.getBaseUrl() + "/api/users/verify-email?token=" +
                verificationCode.getCode();
        Context thymeleafContext = new Context();
        thymeleafContext.setVariable("user", user);
        thymeleafContext.setVariable("verificationLink", verificationLink);
        thymeleafContext.setVariable("applicationName", applicationProperties.getApplicationName());
        String htmlBody = templateEngine.process("welcome-email", thymeleafContext);
        emailService.sendHtmlMessage(List.of(user.getEmail()), "Welcome to ou platform", htmlBody);
        verificationCode.setEmailSent(true);
        verificationCodeRepository.save(verificationCode);
    }

}
