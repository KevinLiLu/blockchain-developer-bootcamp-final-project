# Event Ticketing System (Trusty Tickets)

## Background
This project implements the first steps of an event ticketing system like Ticketmaster/Stubhub.

The two fundamental features currently supported are:
1. Event creation by contract owner (deployer)
2. Ticket purchasing (available to anyone)

We also leverage Chainlink's ETH-USD price feed to ensure users pay a static USD price per ticket.

## Directory Structure
```
web3/ - Contains the Solidity contracts/tests
webapp/ - Contains the simple HTML/CSS/JS webapp
```

The frontend can be accessed at https://kevinlilu.github.io/blockchain-developer-bootcamp-final-project/webapp/. Please use the Kovan network to access the deployed contract.

## Building and Running Solidity Tests
Building and running the Solidity tests requires `npm` and `truffle`.

```
cd web3
npm install
truffle test
```

The `web3/truffle-config.js` file has `networks` commented out so Truffle will by default to spin up a development blockchain at port 9545.

For reference, the project has been tested using the following versions:
```
kevins-mbp:web3 kevin$ truffle version
Truffle v5.4.18 (core: 5.4.18)
Solidity - 0.8.9 (solc-js)
Node v11.15.0
Web3.js v1.5.3

kevins-mbp:web3 kevin$ truffle test
Using network 'test'.


Compiling your contracts...
===========================
> Compiling ./test/MockedTicketing.sol
> Compilation warnings encountered:

    Warning: Function state mutability can be restricted to pure
 --> project:/test/MockedTicketing.sol:8:3:
  |
8 |   function getPriceInWei(uint) public view override returns (uint) {
  |   ^ (Relevant source part starts here and spans across multiple lines).


> Artifacts written to /var/folders/8l/mmp7wp1565jdmcbw2gx2kfz80000gn/T/test--2483-gXPVxzC8wkv2
> Compiled successfully using:
   - solc: 0.8.9+commit.e5eed63a.Emscripten.clang



  Contract: Ticketing
    ✓ should set up initial state (41ms)
    ✓ should create event with provided inputs (214ms)
    ✓ should allow user to purchase a ticket if enough funds are provided (359ms)
    ✓ should give error if user did not send enough funds (1158ms)
    ✓ should give error if user tries to purchase a ticket from a sold out event (259ms)
    ✓ should give error if user tries to purchase more than one ticket for an event (325ms)
    ✓ should only allow owner to create events (49ms)


  7 passing (3s)
```

## Building and Running Frontend
The preferred way to test the frontend is to directly use the deployed instance at https://kevinlilu.github.io/blockchain-developer-bootcamp-final-project/webapp/.

If you need to run the frontend locally, then please install `npm` and execute the following steps:
```
cd webapp
npm install -g live-server
live-server
```

## ETH Address for Certification
`0x39Cb3fF86a069AC632373eE6a6f6BecE6381faa4`

## Future Work
- Ticket transfers
- Ticket validation (QR code)
