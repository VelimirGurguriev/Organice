package com.api.organice.users.data;

import com.api.organice.util.validators.PasswordMatch;
import com.api.organice.util.validators.Unique;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@PasswordMatch(passwordField = "password", passwordConfirmationField = "passwordConfirmation")
@Builder
public class CreateUserRequest {
    @Email
    @Unique(columnName = "email", tableName = "users", message = "User with this email already exists")
    private String email;
    @NotNull
    @Length(min = 8)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "Password must contain at least one uppercase" +
            "letter, one lowercase letter and one digit.")
    private String password;
    private String passwordConfirmation;
    private String username;
}
