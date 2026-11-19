# Spec Delta

## Purpose

Enables checkout processing with address and payment method capture, order validation using cross-MFE auth tokens, order persistence in browser storage, and retrieval of user order history.

## ADDED Requirements

### Requirement: Authenticated Checkout Submission
The orders micro-app SHALL provide a checkout interface that validates the user authentication session before accepting shipping address, payment method selection, and order submission.

#### Scenario: Submitting checkout when authenticated
- **WHEN** an authenticated user fills in shipping address, selects payment method, and confirms checkout with non-empty cart items
- **THEN** an order record with a unique Order ID and current user ID is created, saved to `mfe_ecommerce_orders`, and cart clearing is triggered

#### Scenario: Checkout attempt without authentication
- **WHEN** an unauthenticated visitor navigates to the checkout interface
- **THEN** the system blocks submission and prompts the user to log in first

### Requirement: Order History Display
The orders micro-app SHALL expose a "Pesanan Saya" view that retrieves and displays past order records matching the active authenticated user ID.

#### Scenario: Viewing order history with past orders
- **WHEN** an authenticated user opens the orders page and has past orders in `mfe_ecommerce_orders`
- **THEN** each order is listed with Order ID, creation timestamp, shipping address, payment method, items summary, and total amount

#### Scenario: Viewing order history with no orders
- **WHEN** an authenticated user opens the orders page and has no past orders
- **THEN** an empty order state message is displayed with a link back to catalog
