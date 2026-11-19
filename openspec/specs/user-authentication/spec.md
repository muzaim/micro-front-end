# user-authentication Specification

## Purpose
Provides simulated user authentication, local storage session persistence, authentication state broadcasting, and session guard verification across micro frontends.

## Requirements

### Requirement: User Login with Predefined Credentials
The authentication system SHALL allow a user to log in by validating submitted email and password against any of three predefined dummy accounts: Budi Santoso (`budi@mfe.com` or `user@mfe.com`), Siti Rahma (`siti@mfe.com`), or Andi Pratama (`andi@mfe.com`), each using `password123`.

#### Scenario: Successful login
- **WHEN** user submits valid credentials for any predefined account (e.g. Budi, Siti, or Andi) and `password123`
- **THEN** authentication succeeds, storing that user's session and corresponding mock token in `mfe_auth_session` in `localStorage`

#### Scenario: Invalid credentials
- **WHEN** user submits an unregistered email or incorrect password
- **THEN** authentication fails with an error message and no session is created

### Requirement: Quick Account Autofill Selection
The login interface SHALL provide quick-select buttons for each predefined test account to automatically populate email and password fields for testing convenience.

#### Scenario: Quick select test profile
- **WHEN** user clicks a quick-select account button (e.g., Budi, Siti, or Andi)
- **THEN** the email and password fields in the login modal are populated with that account's credentials

### Requirement: Cross-MFE Auth State Synchronization
The authentication system SHALL broadcast `auth:state-change` events over window events upon login and logout so all micro frontends update reactively.

#### Scenario: Broadcasting login event
- **WHEN** a user logs in successfully
- **THEN** an `auth:state-change` event is dispatched with the active user detail and token

#### Scenario: User logout
- **WHEN** user triggers logout
- **THEN** the session is removed from `mfe_auth_session` and an `auth:state-change` event with null user is dispatched
