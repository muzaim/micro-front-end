# Spec Delta

## MODIFIED Requirements

### Requirement: User Login with Predefined Credentials
The authentication system SHALL allow a user to log in by validating submitted email and password against any of three predefined dummy accounts: Budi Santoso (`budi@mfe.com` or `user@mfe.com`), Siti Rahma (`siti@mfe.com`), or Andi Pratama (`andi@mfe.com`), each using `password123`.

#### Scenario: Successful login
- **WHEN** user submits valid credentials for any predefined account (e.g. Budi, Siti, or Andi) and `password123`
- **THEN** authentication succeeds, storing that user's session and corresponding mock token in `mfe_auth_session` in `localStorage`

#### Scenario: Invalid credentials
- **WHEN** user submits an unregistered email or incorrect password
- **THEN** authentication fails with an error message and no session is created

## ADDED Requirements

### Requirement: Quick Account Autofill Selection
The login interface SHALL provide quick-select buttons for each predefined test account to automatically populate email and password fields for testing convenience.

#### Scenario: Quick select test profile
- **WHEN** user clicks a quick-select account button (e.g., Budi, Siti, or Andi)
- **THEN** the email and password fields in the login modal are populated with that account's credentials
