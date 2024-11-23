package com.api.organice.users;

import com.api.organice.entity.AbstractEntity;
import com.api.organice.users.data.CreateUserRequest;
import com.api.organice.util.ApplicationContextProvider;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
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

    public User(CreateUserRequest data) {
        PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
        this.email = data.getEmail();
        this.password = passwordEncoder.encode(data.getPassword());
        this.username = data.getUsername();
        this.role = Role.USER;
    }
}
