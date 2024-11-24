package com.api.organice.users;

import com.api.organice.entity.AbstractEntity;
import com.api.organice.users.data.CreateUserRequest;
import com.api.organice.util.ApplicationContextProvider;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User extends AbstractEntity {
    private String email;
    private String username;
    private String password;
    private boolean verified = false;
    @Enumerated(EnumType.STRING)
    private Role role;

    @Setter
    @OneToOne(mappedBy = "user")
    private VerificationCode verificationCode;

    public User(CreateUserRequest data) {
        PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
        this.email = data.getEmail();
        this.password = passwordEncoder.encode(data.getPassword());
        this.username = data.getUsername();
        this.role = Role.USER;
    }
}
