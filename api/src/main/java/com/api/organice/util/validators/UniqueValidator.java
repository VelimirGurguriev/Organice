package com.api.organice.util.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

@Component
public class UniqueValidator implements ConstraintValidator<Unique, String> {

    private static final Logger log = LoggerFactory.getLogger(UniqueValidator.class);

    private final JdbcClient jdbcClient;

    private String tableName;

    private String columnName;

    public UniqueValidator(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }


    @Override
    public void initialize(Unique constraintAnnotation) {
        tableName = constraintAnnotation.tableName();
        columnName = constraintAnnotation.columnName();
        log.info("Initializing UniqueValidator with table: {}, column: {}", tableName, columnName);
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        if (!isSafeIdentifier(tableName) || !isSafeIdentifier(columnName)) {
            throw new IllegalArgumentException("Invalid table or column name");
        }

        String query = "SELECT EXISTS (SELECT 1 FROM \"" + tableName + "\" WHERE \"" + columnName + "\" = ?)";
        try {
            Boolean exists = jdbcClient.sql(query)
                    .param(value)
                    .query(Boolean.class)
                    .single();

            log.info("Query: {}, Value: {}, Exists: {}", query, value, exists);
            return !exists;
        } catch (Exception e) {
            log.error("Error executing query: {}", query, e);
            throw e;
        }
    }

    private boolean isSafeIdentifier(String identifier) {
        return identifier != null && identifier.matches("^[a-zA-Z_][a-zA-Z0-9_]*$");
    }

}