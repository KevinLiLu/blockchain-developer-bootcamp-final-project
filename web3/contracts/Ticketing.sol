// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title An event ticketing contract
/// @author Kevin Lu
/// @notice This contract implements the most basic event ticketing requirements of event creation and ticket purchasing
contract Ticketing is Ownable {

  AggregatorV3Interface internal priceFeed;

  /// @notice Stores the number of created events (which also is the event id for now)
  uint public eventCount = 0;
  /// @notice Stores the number of purchased tickets (which also is the ticket id for now)
  uint public ticketCount = 0;
  /// @notice Stores a mapping of event id to Event struct
  mapping(uint => Event) public events;
  /// @notice Stores an array of created event ids
  uint[] public eventIds;
  /// @notice Stores a mapping of attendee address to Attendee struct
  mapping(address => Attendee) attendees;
  /// @notice Stores a mapping of ticket id to Ticket struct
  mapping(uint => Ticket) public tickets;

  struct Event {
    string name;
    uint id;
    address organizer;
    uint pricePerTicketInUsd;
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

  constructor() {
    priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
  }

  modifier paidEnough(uint _eventID) {
    uint pricePerTicketInUsd = events[_eventID].pricePerTicketInUsd;
    require(msg.value >= getPriceInWei(pricePerTicketInUsd), "Funds sent must cover price of ticket!");
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

  /// @notice Calculate USD ticket price in wei
  /// @param _priceInUsd The price of a ticket in USD
  /// @return Ticket price in wei
  function getPriceInWei(uint _priceInUsd) public view virtual returns (uint) {
    (,int price,,,) = priceFeed.latestRoundData();
    uint usdToWei = (10**18)*(10**priceFeed.decimals())/uint(price);
    return _priceInUsd * usdToWei;
  }

  /// @notice Create an event with provided parameters. Only the contract owner (deployer) can perform this action.
  /// @param _name Name of event
  /// @param _pricePerTicketInUsd The price of a ticket in USD
  /// @param _maxTickets Max tickets to sell
  /// @return Created event id
  function createEvent(string memory _name, uint _pricePerTicketInUsd, uint _maxTickets) public onlyOwner() returns (uint) {
    // registers a new event and returns the newly created event id
    uint eventId = eventCount;

    Event memory eventStruct = Event({
      name: _name,
      id: eventId,
      organizer: msg.sender,
      pricePerTicketInUsd: _pricePerTicketInUsd,
      maxTickets: _maxTickets,
      ticketCount: 0
    });

    events[eventId] = eventStruct;
    eventIds.push(eventId);

    eventCount = eventId + 1;

    return eventId;
  }

  /// @notice Purchase a ticket for the given event id
  /// @param _eventID Event id to purchase ticket from
  /// @return Purchased ticket id
  function purchaseTicket(uint _eventID) public payable paidEnough(_eventID) hasRemainingTickets(_eventID) doesNotAlreadyOwn(_eventID, msg.sender) returns (uint) {
    // purchase a ticket from the provided event
    Event storage eventStruct = events[_eventID];
    uint ticketId = ticketCount;
    ticketCount = ticketCount + 1;
    eventStruct.ticketCount = eventStruct.ticketCount  + 1;

    Attendee storage attendee = attendees[msg.sender];
    attendee.ticketIds.push(ticketId);
    attendee.events[_eventID] = true;
    attendee.tickets[_eventID] = Ticket({
      ticketId: ticketId,
      eventId: _eventID
    });

    uint priceInWei = getPriceInWei(eventStruct.pricePerTicketInUsd);

    (bool success, ) = eventStruct.organizer.call{value: priceInWei}('');
    require(success, "Transfer failed.");

    return ticketId;
  }

  /// @notice Get all event ids
  /// @return Event ids
  function getAllEventIds() public view returns (uint[] memory) {
    return eventIds;
  }

  /// @notice Get ticket ids for a given attendee
  /// @param attendee Attendee address
  /// @return Ticket ids owned by the attendee address
  function getTickets(address attendee) public view returns (uint[] memory) {
    return attendees[attendee].ticketIds;
  }
}
