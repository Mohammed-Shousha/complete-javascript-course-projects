'use strict';

// Data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

// New Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 888],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2023-09-27T23:36:17.929Z',
    '2023-10-01T10:51:36.790Z',
    `${new Date().toISOString()}`,
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createUsernames = accounts => {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

// const getDateDetails = date => {
//   return {
//     year: date.getFullYear(),
//     month: `${date.getMonth() + 1}`.padStart(2, 0),
//     day: `${date.getDate()}`.padStart(2, 0),
//     hour: date.getHours(),
//     min: `${date.getMinutes()}`.padStart(2, 0),
//   };
// };

const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

const formatMovementDate = (date, locale) => {
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'today';
  if (daysPassed === 1) return 'yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = (value, currency, locale) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

const displayCurrentTime = locale => {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(new Date());
};

const displayMovements = (account, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // const movDate = getDateDetails(new Date(account.movementsDates[i]));
    // const { year, month, day } = movDate;

    const movDate = formatMovementDate(
      new Date(account.movementsDates[i]),
      account.locale
    );

    const formattedMov = formatCurrency(mov, account.currency, account.locale);

    const movementRow = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${movDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', movementRow);
  });
};

const calcBalance = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  return formatCurrency(account.balance, account.currency, account.locale);
};

const displayBalance = balance => {
  labelBalance.textContent = balance;
};

const calcSummary = account => {
  const deposits = account.movements.filter(mov => mov > 0);
  const withdraws = account.movements.filter(mov => mov < 0);

  const ins = deposits.reduce((acc, mov) => acc + mov, 0);

  const outs = withdraws.reduce((acc, mov) => acc + mov, 0);

  const interests = deposits
    .map(mov => mov * (account.interestRate / 100))
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);

  return [ins, Math.abs(outs), interests].map(e =>
    formatCurrency(e, account.currency, account.locale)
  );
};

const displaySummary = (ins, outs, interests) => {
  labelSumIn.textContent = ins;
  labelSumOut.textContent = outs;
  labelSumInterest.textContent = interests;
};

const updateUI = account => {
  displayMovements(account);
  displayBalance(calcBalance(account));
  displaySummary(...calcSummary(account));
};

const showApp = () => {
  labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`; // user first name
  containerApp.style.opacity = 100;
};

const resetApp = () => {
  labelWelcome.textContent = 'Log in to get started';
  containerApp.style.opacity = 0;
};

const startLogOutTimer = () => {
  let time = 120;

  const tick = () => {
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const sec = `${time % 60}`.padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      resetApp();
    }

    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

const checkAmount = (amount, account) =>
  amount > 0 && account.balance >= amount;

const checkReceiver = (fromAccount, toAccount) =>
  toAccount && toAccount.username !== fromAccount.username;

let currentAccount, timer;

// Handlers Functions

const handleLogin = e => {
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    showApp();

    // const now = getDateDetails(new Date());
    // const { year, month, day, hour, min } = now;
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    labelDate.textContent = displayCurrentTime(currentAccount.locale);

    updateUI(currentAccount);

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
  }
};

const handleTransfer = e => {
  e.preventDefault();

  const receiverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  if (
    checkAmount(amount, currentAccount) &&
    checkReceiver(currentAccount, receiverAccount)
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferTo.blur();
  inputTransferAmount.blur();
};

const handleRequestLoan = e => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }

  inputLoanAmount.value = '';
};

const handleCloseAccount = e => {
  e.preventDefault();

  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (currentAccount.username === username && currentAccount.pin === pin) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );

    accounts.splice(index, 1);

    resetApp();
  }

  inputCloseUsername.value = inputClosePin.value = '';
};

let sorted = false;

const handleSortMovements = e => {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);

  sorted = !sorted;
};

// Event Listeners
btnLogin.addEventListener('click', handleLogin);
btnTransfer.addEventListener('click', handleTransfer);
btnClose.addEventListener('click', handleCloseAccount);
btnLoan.addEventListener('click', handleRequestLoan);
btnSort.addEventListener('click', handleSortMovements);
