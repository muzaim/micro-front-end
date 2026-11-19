# catalog-browsing Specification

## Purpose
Enables product browsing, product details viewing, and dispatches decoupled purchase intent events for downstream consumers.

## Requirements

### Requirement: Product Catalog Listing
The catalog micro-app SHALL render a list of products with title, price, description, and thumbnail image in both standalone and federated host contexts.

#### Scenario: View product list
- **WHEN** the catalog component is mounted
- **THEN** it renders available products in a responsive grid layout

### Requirement: Product Detail Display
The catalog micro-app SHALL allow users to view detailed information for a selected product.

#### Scenario: Select a product
- **WHEN** the user selects a product from the list
- **THEN** the product detail view is displayed showing complete specifications and an "Add to Cart" action

### Requirement: Add to Cart Event Emission
The catalog micro-app SHALL dispatch a standardized cart add event when a user requests to add a product to the cart without direct coupling to the cart application.

#### Scenario: Click add to cart
- **WHEN** the user clicks "Add to Cart" on a product
- **THEN** a `cart:add-item` event is dispatched with product ID, title, and price in the payload
