# shell-navigation Specification

## Purpose
Provides host-level navigation, layout shell, routing orchestration for federated micro frontends, and error boundary isolation to ensure application resilience.

## Requirements

### Requirement: Global Navigation and Routing
The shell SHALL provide a persistent layout containing a header, navigation bar, and content outlet, orchestrating client-side routing to load remote micro-apps based on the active path, including catalog, cart, checkout, and orders views.

#### Scenario: Navigating to catalog route
- **WHEN** the user navigates to `/` or `/products`
- **THEN** the shell renders the persistent header and mounts the remote catalog view in the content area

#### Scenario: Navigating to cart route
- **WHEN** the user navigates to `/cart`
- **THEN** the shell renders the persistent header and mounts the remote cart view in the content area

#### Scenario: Navigating to checkout route
- **WHEN** the user navigates to `/checkout`
- **THEN** the shell mounts the remote orders checkout view within a remote boundary

#### Scenario: Navigating to orders route
- **WHEN** the user navigates to `/orders`
- **THEN** the shell mounts the remote orders history view within a remote boundary

### Requirement: Remote Error Boundary Isolation
The shell SHALL wrap dynamically loaded remote components in error boundaries so that failures in one remote app do not break the entire host shell or other remotes.

#### Scenario: Remote loading failure
- **WHEN** a remote micro-app fails to load due to network error or service unavailability
- **THEN** the shell displays a fallback error alert for that section while keeping the global navigation fully functional

### Requirement: Shell Auth Header Controls
The shell header SHALL render authentication status controls including a login button when unauthenticated, and user profile name with logout action when authenticated.

#### Scenario: Header displays login button for guest
- **WHEN** no active auth session exists
- **THEN** header displays a "Login" button that opens the login modal

#### Scenario: Header displays user details and logout
- **WHEN** an active auth session exists
- **THEN** header displays the user's name, a link to "Pesanan Saya" (`/orders`), and a "Logout" action
