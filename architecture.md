# Requirements

## Web App Features

### User can create an event
User (organizer) should be able to create an event.

### User can get details of an event given event id
Given event id, user should be able to get full event details.

This requires a mapping of event id to Event struct.
```
mapping(uint => Event) public events;  // event id to Event struct
```

### User can explore events
User (anyone) should be able to list and explore events.

To support this, we need the ability to retrieve the list of events along with the event information. As we already have a mapping of event id to Event struct, we just need to store an additional array of event ids to enable enumeration.
```
uint[] public eventIds;  // UI can get list of all event ids and then query events mapping to get event details
mapping(uint => Event) public events;
```

### User can purchase event ticket
User should be able to purchase an event ticket (if available).

### User can view their tickets/events
UI should provide user with a list of their events.



### User can manage their events


### Organizer can refund a ticket holder
Organizer should be able to refund a ticket holder, which returns the user's funds and revokes their ticket.

# Contracts

## PriceDependent.sol
Contract that provides price feed API for use-cases that require external pricing (ex. ETH/USD price) instead of purely ETH values.

## Ticketing.sol
