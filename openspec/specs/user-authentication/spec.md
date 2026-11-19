# user-authentication Specification

## Purpose
Provides simulated user authentication, local storage session persistence, authentication state broadcasting, and session guard verification across micro frontends.

## Requirements

### Requirement: User Login with Predefined Credentials
The authentication system SHALL allow a user to log in by validating submitted email and password against predefined dummy credentials (`user@mfe.com` / `password123`).

#### Scenario: Successful login
- **WHEN** user submits `user@mfe.com` and `password123` in the login form
- **THEN** authentication succeeds, storing a valid session and mock token in `mfe_auth_session` in `localStorage`

#### Scenario: Invalid credentials
- **WHEN** user submits incorrect email or password
- **THEN** authentication fails with an error message and no session is created

### Requirement: Cross-MFE Auth State Synchronization
The authentication system SHALL broadcast `auth:state-change` events over window events upon login and logout so all micro frontends update reactively.

#### Scenario: Broadcasting login event
- **WHEN** a user logs in successfully
- **THEN** an `auth:state-change` event is dispatched with the active user detail and token

#### Scenario: User logout
- **WHEN** user triggers logout
- **THEN** the session is removed from `mfe_auth_session` and an `auth:state-change` event with null user is dispatched
