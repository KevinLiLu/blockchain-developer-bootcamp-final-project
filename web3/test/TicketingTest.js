const Ticketing = artifacts.require("MockedTicketing");

contract("Ticketing", async accounts => {
  const eventName = "Test";
  const pricePerTicketInUsd = 10;
  const maxTickets = 1;
  const bob = accounts[0];
  const alice = accounts[1];
  const joe = accounts[2];

  var instance;

  beforeEach(async () => {
    instance = await Ticketing.new();
  });

  // This test validates that the initial state is set up correctly.
  it("should set up initial state", async () => {
    assert(await instance.eventCount.call(), 0);
    assert(await instance.ticketCount.call(), 0);
  });

  // This test validates event creation sets the proper fields.
  it("should create event with provided inputs", async () => {
    await instance.createEvent(eventName, pricePerTicketInUsd, maxTickets, { from: bob });
    assert(await instance.eventCount.call(), 1, "event count should be 1");
    const eventIds = await instance.getAllEventIds();
    assert(eventIds.length, 1, "contract should have one event");
    assert(eventIds[0], 0, "created event should have id of 0");
    const event = await instance.events.call(0);
    assert(event.name, eventName);
    assert(event.id, 0);
    assert(event.organizer, bob);
    assert(event.pricePerTicketInUsd, pricePerTicketInUsd);
    assert(event.maxTickets, maxTickets);
    assert(event.ticketCount, 0);
  });

  // This test validates that ticket purchasing works if user sent enough funds.
  it("should allow user to purchase a ticket if enough funds are provided", async () => {
    await instance.createEvent(eventName, pricePerTicketInUsd, maxTickets, { from: bob });
    await instance.purchaseTicket(0, { value: 100, from: alice });
    assert(await instance.ticketCount.call(), 1);
    const tickets = await instance.getTickets(alice);
    assert(tickets.length, 1);
    assert(tickets[0], 0);
    const ticket = await instance.tickets.call(0);
    assert(ticket.ticketId, 0);
  });

  // This test validates that the transaction will revert if the user does not send enough funds
  // when trying to purchase a ticket.
  it("should give error if user did not send enough funds", async () => {
    await instance.createEvent(eventName, pricePerTicketInUsd, maxTickets, { from: bob });
    try {
      await instance.purchaseTicket(0, { value: 99 });
      assert.fail("should have thrown not enough funds error");
    } catch (err) {
      assert.include(err.message, "revert Funds sent must cover price of ticket!");
    }
  });

  // This test validates that the transaction will revert if someone tries to purchase tickets from
  // a sold out event (no remaining tickets left).
  it("should give error if user tries to purchase a ticket from a sold out event", async () => {
    await instance.createEvent(eventName, pricePerTicketInUsd, maxTickets, { from: bob });
    await instance.purchaseTicket(0, { value: 100, from: alice });
    try {
      await instance.purchaseTicket(0, { value: 100, from: joe });
      assert.fail("should have thrown no remaining tickets error");
    } catch (err) {
      assert.include(err.message, "revert No remaining tickets!");
    }
  });

  // This test validates that the transaction will revert if someone tries to purchase more than one
  // ticket for a single event.
  it("should give error if user tries to purchase more than one ticket for an event", async () => {
    await instance.createEvent(eventName, pricePerTicketInUsd, 2, { from: bob });
    await instance.purchaseTicket(0, { value: 100, from: alice });
    try {
      await instance.purchaseTicket(0, { value: 100, from: alice });
      assert.fail("should have thrown user already owns ticket error");
    } catch (err) {
      assert.include(err.message, "revert User already owns a ticket!");
    }
  });
});
