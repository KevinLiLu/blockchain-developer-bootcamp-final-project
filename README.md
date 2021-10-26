# Event Ticketing System

## Problem Statement
Websites like Stubhub and SeatGeek provide a large secondary ticket market for customers to buy/sell tickets after the original purchase. The secondary ticket market is necessary as popular events will sell out quickly (if not instantly), or some ticket holders may not be able to make the event anymore.

A lot of people choose to avoid these sites as they:
1. Charge high fees
2. A purchased ticket may be fake or invalid
     - They provide Purchase Guarantee so they will replace/refund however it is still an annoying process to experience
3. Physical tickets must be shipped which introduces another layer of uncertainty

Many people use Facebook Marketplace or Craigslist however ticket scams are very common as it is hard to verify the authenticity and ownership of tickets. In some cases, people lose thousands of dollars from these scams.

## Solution
Blockchain and Ethereum provide mechanisms for verifying identity and ownership of digital goods. Therefore, we can use an Ethereum smart contract to implement a ticketing system in which the smart contract manages the entire ticketing lifeycle:
- Purchasing a ticket (from event organizer)
- Validating ticket authenticity/ownership (when selling/buying tickets on secondary market)
- Scanning ticket at event entrance (by event organizer)
- Ticket transfer (transferring ticket to someone else)

## Workflow
All operations will be performed on a website which will directly interact with the smart contract.

### Event Organizer
1. Event organizer will create an Event Organizer account
2. Event organizer will create an Event

### Event Attendee
1. Event attendee will create an Event Attendee account
2. Event attendee will register and pay for an Event
3. Event attendee can generate a QR code or link to their ticket which proves authenticity/ownership
4. Event attendee can transfer their ticket to another account

### Anybody
1. Anybody should be able to use the QR code or link provided by Event Attendee to verify the authenticity/ownership of a ticket
