# Avoiding Common Attacks

## Using Specific Compiler Pragma 
Our contract (including our unit tests) specifies version 0.8.9.

## Proper Use of Require, Assert and Revert 
We use `require` throughout the contract to validate conditions:
- `paidEnough` modifier uses `require` to ensure the user has paid enough ETH to purchase a ticket
- `hasRemainingTickets` modifier uses `require` to ensure there are remaining tickets for an event
- `doesNotAlreadyOwn` modifier uses `doesNotAlreadyOwn` to ensure an attendee can only purchase up to 1 ticket for a single event

## Checks-Effects-Interactions
When an attendee purchases a ticket, we ensure all state changes occur before the external call (transfer of funds).

## Proper use of .call and .delegateCall
We use `call` instead of `transfer` to transfer funds from the attendee to the event organizer when purchasing a ticket.