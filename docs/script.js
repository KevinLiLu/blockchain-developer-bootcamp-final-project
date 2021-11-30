const address = '0x24a0420d640D8e6a758B25df36eE47526836f09d';

var web3;
var abi;
var ticketingContract;

// Detect MetaMask
// If MetaMask not found, then show error
window.addEventListener('load', async () => {
  if (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask === true) {
    console.log('MetaMask is active');
    [].forEach.call(document.querySelectorAll('.requires-web3'), function (el) {
      el.style.display = 'inline';
    });
    web3 = new Web3(window.ethereum);
    // Fetch ABI to construct contract
    abi = (await (await fetch('../web3/build/contracts/Ticketing.json')).json()).abi;
    ticketingContract = new web3.eth.Contract(abi, address);
    // Check to see if user has connected before (non-empty array)
    const accounts = await web3.eth.getAccounts();
    if (accounts.length == 0) {
      // User's metamask account is not connected to our dapp
      document.getElementById('connect-button').style.display = 'inline';
    } else {
      // Account connected so show My Events and Manage Events
      getMyEvents();
      getManageEvents();
    }
    getAllEvents();
  } else {
    console.log('MetaMask is not available')
    document.getElementById('web3-error').style.display = 'inline';
  }
})

document.getElementById('connect-button').onclick = async () => {
  connect();
}

const connect = async () => {
  await ethereum.request({ method: 'eth_requestAccounts'});
  document.getElementById('connect-button').style.display = 'none';
  getMyEvents();
  getManageEvents();
}

const getMyEvents = async () => {
  document.getElementById('my-events').style.display = 'inline';
  const address = (await web3.eth.getAccounts())[0];
  const tickets = await ticketingContract.methods.getTickets(address).call();
  for (var i = 0; i < tickets.length; i++) {
    const ticketId = tickets[i];
    const ticket = await ticketingContract.methods.tickets(ticketId).call();
    const eventId = ticket.eventId;
    const eventName = (await ticketingContract.methods.events(eventId).call()).name;
    // Insert event row to My Events table
    var tbodyRef = document.getElementById('my-events-table').getElementsByTagName('tbody')[0];
    var row = tbodyRef.insertRow(0);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = ticketId;
    var cell2 = row.insertCell(1);
    cell2.innerHTML = eventName;
    var cell3 = row.insertCell(2);
    cell3.innerHTML = eventId;
  }
}

const getManageEvents = () => {
  // console.log('get manage events');
  // document.getElementById('manage-events').style.display = 'inline';
}

const getAllEvents = async () => {
  document.getElementById('all-events').style.display = 'inline';
  const eventIds = await ticketingContract.methods.getAllEventIds().call();
  for (var i = 0; i < eventIds.length; i++) {
    const event = await ticketingContract.methods.events(eventIds[i]).call();
    // Insert event row to All Events table
    var tbodyRef = document.getElementById('all-events-table').getElementsByTagName('tbody')[0];
    var row = tbodyRef.insertRow(0);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = event.id;
    var cell2 = row.insertCell(1);
    cell2.innerHTML = event.name;
    var cell3 = row.insertCell(2);
    cell3.innerHTML = event.organizer;
    var cell4 = row.insertCell(3);
    cell4.innerHTML = event.pricePerTicketInUsd;
    var cell5 = row.insertCell(4);
    cell5.innerHTML = event.ticketCount + '/' + event.maxTickets;
    var cell6 = row.insertCell(5);
    cell6.innerHTML = "<button class='purchase-btn' onclick='purchase(" + event.id + "," + event.pricePerTicketInUsd + ")'>Purchase</button>";
  }
}

document.getElementById('create-form').onsubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const eventName = form.elements['eventName'].value;
  const pricePerTicketInUsd = form.elements['pricePerTicketInUsd'].value;
  const maxTickets = form.elements['maxTickets'].value;

  try {
    clearErrors();
    const address = (await web3.eth.getAccounts())[0];
    await ticketingContract.methods.createEvent(eventName, pricePerTicketInUsd, maxTickets).send({ from: address });
    window.location.reload();
  } catch (err) {
    document.getElementById('submit-error').innerHTML = 'Error: ' + err.message;
    document.getElementById('submit-error').style.display = 'inline';
    console.log(err);
  }
}

const purchase = async (eventId, pricePerTicketInUsd) => {
  try {
    clearErrors();
    const address = (await web3.eth.getAccounts())[0];
    const pricePerTicketInWei = await ticketingContract.methods.getPriceInWei(pricePerTicketInUsd).call();
    await ticketingContract.methods.purchaseTicket(eventId).send({ from: address, value: pricePerTicketInWei });
    window.location.reload();
  } catch (err) {
    document.getElementById('purchase-error').innerHTML = 'Error: ' + err.message;
    document.getElementById('purchase-error').style.display = 'inline';
    console.log(err);
  }
}

const clearErrors = () => {
  document.getElementById('submit-error').style.display = 'none';
  document.getElementById('purchase-error').innerHTML = '';
  document.getElementById('purchase-error').style.display = 'none';
  document.getElementById('submit-error').innerHTML = '';
}