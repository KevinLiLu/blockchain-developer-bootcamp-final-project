# Scaffolding

In our first version, organizers and attendees will have to directly interact with the contract (ex. using metamask). In future versions, we can explore delegation in which attendees do not have to directly interact with the contract.

## 1. Organizers will have to register themselves on the contract
```
function registerOrganizer(address _organizer) public {
  // registers organizer
};
```

## 2. Organizers can create events
```
function createEvent(string eventName, uint price, uint numTickets) public returns (uint) {
  // registers a new event and returns the newly created event id
}
```

## 3. Attendees can purchase a ticket from an event
```
function purchaseTicket(uint eventID) public {
  // purchase a ticket from the provided event
}
```

## 4. Attendees can transfer their ticket to another user
```
function transferTicket(uint ticketId, address _receiver) public {
  // transfer ticket to anothr user
}
```
