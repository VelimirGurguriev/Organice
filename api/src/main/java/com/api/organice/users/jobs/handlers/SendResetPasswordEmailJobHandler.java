package com.api.organice.users.jobs.handlers;

import com.api.organice.config.ApplicationProperties;
import com.api.organice.email.EmailService;
import com.api.organice.users.PasswordResetToken;
import com.api.organice.users.User;
import com.api.organice.users.jobs.SendResetPasswordEmailJob;
import com.api.organice.users.repository.PasswordResetTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jobrunr.jobs.context.JobContext;
import org.jobrunr.jobs.lambdas.JobRequestHandler;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;

@Component
@RequiredArgsConstructor
public class SendResetPasswordEmailJobHandler implements JobRequestHandler<SendResetPasswordEmailJob> {

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final ApplicationProperties applicationProperties;
    private final SpringTemplateEngine templateEngine;

    @Override
    @Transactional
    public void run(SendResetPasswordEmailJob sendResetPasswordEmailJob) throws Exception {
        PasswordResetToken resetToken = passwordResetTokenRepository.findById(sendResetPasswordEmailJob.getTokenId())
                .orElseThrow(() -> new IllegalArgumentException("Token not found"));
        if (!resetToken.isEmailSent()) {
            sendResetPasswordEmail(resetToken.getUser(), resetToken);
        }
    }

    private void sendResetPasswordEmail(User user, PasswordResetToken resetToken) {
        String link = applicationProperties.getBaseUrl() + "/auth/reset-password?token=" + resetToken.getToken();
        Context thymeleafContext = new Context();
        thymeleafContext.setVariable("user", user);
        thymeleafContext.setVariable("link", link);
        String htmlBody = templateEngine.process("password-reset", thymeleafContext);
        emailService.sendHtmlMessage(List.of(user.getEmail()), "Password reset requested", htmlBody);
        resetToken.onEmailSent();
        passwordResetTokenRepository.save(resetToken);
    }
}
