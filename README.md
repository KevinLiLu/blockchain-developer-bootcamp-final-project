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

The frontend can be accessed at https://kevinlilu.github.io/blockchain-developer-bootcamp-final-project/webapp/.

## Building and Running Solidity Tests
Building and running the Solidity tests requires `npm` and `truffle`.

```
cd web3
npm install
truffle test
```

The `web3/truffle-config.js` file has `networks` commented out so Truffle will by default to spin up a development blockchain at port 9545. 

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
