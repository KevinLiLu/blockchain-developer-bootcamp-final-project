const address = '0x3f0055AC875D8bE285d32f6Af6539Ed18c5A8d68';

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

const getMyEvents = () => {
  console.log('get my events');
  document.getElementById('my-events').style.display = 'inline';
}

const getManageEvents = () => {
  console.log('get manage events');
  document.getElementById('manage-events').style.display = 'inline';
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
  }
}