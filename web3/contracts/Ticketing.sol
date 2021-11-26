// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

contract Ticketing {

  uint public eventCount = 0;

  mapping(uint => Event) public events;
  uint[] public eventIds;
  mapping(uint => mapping(address => Attendee)) public attendees;

  struct Attendee {
    address attendee;
    uint ticketId;
  }

  struct Event {
    string name;
    uint id;
    address organizer;
    uint pricePerTicket;
    uint maxTickets;
    uint ticketCount;
  }

  modifier paidEnough(uint _eventID) {
    uint pricePerTicket = events[_eventID].pricePerTicket;
    require(msg.value > pricePerTicket, "Funds sent must cover price of ticket!");
    _;
  }

  modifier hasRemainingTickets(uint _eventID) {
    Event storage eventStruct = events[_eventID];
    require(eventStruct.ticketCount < eventStruct.maxTickets, "No remaining tickets!");
    _;
  }

  modifier doesNotAlreadyOwn(uint _eventID, address _purchaser) {
    require(attendees[_eventID][_purchaser].attendee == address(0), "User already owns a ticket!");
    _;
  }

  function createEvent(string memory _name, uint _pricePerTicket, uint _maxTickets) public returns (uint) {
    // registers a new event and returns the newly created event id
    uint eventId = eventCount;

    Event memory eventStruct = Event({
      name: _name,
      id: eventId,
      organizer: msg.sender,
      pricePerTicket: _pricePerTicket,
      maxTickets: _maxTickets,
      ticketCount: 0
    });

    events[eventId] = eventStruct;
    eventIds.push(eventId);

    eventCount = eventId + 1;

    return eventId;
  }

  function purchaseTicket(uint _eventID) public payable paidEnough(_eventID) hasRemainingTickets(_eventID) doesNotAlreadyOwn(_eventID, msg.sender) returns (uint) {
    // purchase a ticket from the provided event
    Event storage eventStruct = events[_eventID];
    uint ticketId = eventStruct.ticketCount;
    eventStruct.ticketCount = ticketId + 1;

    attendees[_eventID][msg.sender] = Attendee({
      attendee: msg.sender,
      ticketId: ticketId
    });

    payable(eventStruct.organizer).transfer(eventStruct.pricePerTicket);

    return ticketId;
  }

  function getAllEventIds() public view returns (uint[] memory) {
    return eventIds;
  }
}
