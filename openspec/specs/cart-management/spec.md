# cart-management Specification

## Purpose
Manages shopping cart items, maintains state across user interactions, provides a mini-cart header badge, and renders the dedicated cart view.

## Requirements

### Requirement: Mini Cart Badge
The cart micro-app SHALL expose a mini-cart badge component displaying the total count of distinct items or quantities currently in the cart.

#### Scenario: Display current item count
- **WHEN** the mini-cart badge is rendered in the host header
- **THEN** it displays the current total item count and updates dynamically when items are added

### Requirement: Full Cart Page Display
The cart micro-app SHALL expose a full cart page view displaying all added items, their quantities, line-item totals, and an order summary calculation.

#### Scenario: View cart with items
- **WHEN** the cart page is opened and contains items
- **THEN** each item is listed with title, price, quantity controls (increment/decrement/remove), and total price is calculated

#### Scenario: View empty cart
- **WHEN** the cart page is opened and contains no items
- **THEN** an empty cart message is displayed with a link to continue shopping

### Requirement: Reactive Event Ingestion
The cart micro-app SHALL listen for global `cart:add-item` events and update its internal cart state accordingly without requiring direct function calls from sender remotes.

#### Scenario: Receive add item event
- **WHEN** a `cart:add-item` event is detected on the window event bus
- **THEN** the specified item is added to the cart state and the mini-cart badge count increments
