// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

contract Ticketing {

  uint public eventCount = 0;
  uint public ticketCount = 0;

  mapping(uint => Event) public events;  // event id to Event struct
  uint[] public eventIds;

  mapping(address => Attendee) attendees;  // attendee address to Attendee struct
  mapping(uint => Ticket) public tickets;  // ticket id to Ticket struct

  struct Event {
    string name;
    uint id;
    address organizer;
    uint pricePerTicket;
    uint maxTickets;
    uint ticketCount;
  }

  struct Ticket {
    uint ticketId;
    uint eventId;
  }

  struct Attendee {
    uint[] ticketIds;
    mapping(uint => Ticket) tickets;  // ticket id to Ticket struct
    mapping(uint => bool) events;  // event id to bool (true if has ticket for event)
  }

  modifier paidEnough(uint _eventID) {
    uint pricePerTicket = events[_eventID].pricePerTicket;
    require(msg.value >= pricePerTicket, "Funds sent must cover price of ticket!");
    _;
  }

  modifier hasRemainingTickets(uint _eventID) {
    Event storage eventStruct = events[_eventID];
    require(eventStruct.ticketCount < eventStruct.maxTickets, "No remaining tickets!");
    _;
  }

  modifier doesNotAlreadyOwn(uint _eventID, address _purchaser) {
    require(attendees[_purchaser].events[_eventID] == false, "User already owns a ticket!");
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
    uint ticketId = ticketCount;
    ticketCount = ticketCount + 1;
    eventStruct.ticketCount = ticketId + 1;

    Attendee storage attendee = attendees[msg.sender];
    attendee.ticketIds.push(ticketId);
    attendee.events[_eventID] = true;
    attendee.tickets[_eventID] = Ticket({
      ticketId: ticketId,
      eventId: _eventID
    });

    payable(eventStruct.organizer).transfer(eventStruct.pricePerTicket);

    return ticketId;
  }

  function getAllEventIds() public view returns (uint[] memory) {
    return eventIds;
  }

  function getTickets(address attendee) public view returns (uint[] memory) {
    return attendees[attendee].ticketIds;
  }
}
