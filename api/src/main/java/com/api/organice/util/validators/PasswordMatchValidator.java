package com.api.organice.util.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.lang.reflect.Field;

public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, Object> {

    private String passwordFieldName;

    private String passwordMatchFieldName;

    @Override
    public void initialize(PasswordMatch constraintAnnotation) {
        passwordFieldName = constraintAnnotation.passwordField();
        passwordMatchFieldName = constraintAnnotation.passwordConfirmationField();
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext constraintValidatorContext) {
        try {
            Class<?> clazz = obj.getClass();
            Field passwordField = clazz.getDeclaredField(passwordFieldName);
            Field passwordMatchField = clazz.getDeclaredField(passwordMatchFieldName);
            passwordField.setAccessible(true);
            passwordMatchField.setAccessible(true);

            String password = (String) passwordField.get(obj);
            String passwordMatch = (String) passwordMatchField.get(obj);

            return password != null && password.equals(passwordMatch);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
            return false;
        }
    }
}
