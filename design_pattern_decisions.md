# Design Pattern Decisions
This project satisfies various Design Pattern Decisions through the usage of:
1. Chainlink ETH-USD price feed to convert price of ticket in USD to wei for ticket purchasing
2. OpenZeppelin Ownable usage to restrict event creation to the contract owner (deployer)

## Inter-Contract Execution
We call Chainlink's ETH-USD price feed contract which is deployed in Kovan at `0x9326BFA02ADD2366b30bacB125260Af641031331`.

## Inheritance and Interfaces
We inherit from OpenZeppelin's Ownable contract to restrict event creation to the contract owner (deployer).

## Oracles
We use Chainlink's ETH-USD price feed since we store price of ticket in USD, and have to convert USD to ETH when someone wants to purchase a ticket.

## Access Control Design Patterns
We use OpenZeppelin's Ownable contract to restrict event creation to the contract owner (deployer).
