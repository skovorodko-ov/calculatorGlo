'use strict';

const isNumber = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const  btnStart = document.getElementById('start'),
    incomePlus = document.getElementsByTagName('button')[0],
    expensesPlus = document.getElementsByTagName('button')[1],
    depositCheck = document.querySelector('#deposit-check'),
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
    budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
    targetMonthValue = document.getElementsByClassName('target_month-value')[0],
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-title'),
    expensesTitle = document.querySelector('.expenses-title'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount'),
    data = document.querySelector('.data'),
    depositBank = document.querySelector('.deposit-bank'),
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent'),
    btnCancel = document.getElementById('cancel');

let leftInputsText = data.querySelectorAll('[type="text"]'),
    incomeItem = document.querySelectorAll('.income-items'),
    expensesItems = document.querySelectorAll('.expenses-items');

const re = /[a-zA-Z0-9]/,
  reNum = /[0-9]/;


class AppData {
  constructor () {
    this.income= {};
    this.incomeMonth= 0;
    this.addIncome= [];
    this.expenses= {};
    this.addExpenses= [];
    this.deposit= false;
    this.percentDeposit= 0;
    this.moneyDeposit= 0;
    this.budget= 0;
    this.budgetDay= 0;
    this.budgetMonth= 0;
    this.expensesMonth= 0;
  }

  start() {
    this.budget = +salaryAmount.value;
    this.getExpInc();
    this.getInfoDeposit();
    this.getExpenseMonth();
    this.getAddExpInc();
    this.getBudget();
    this.showResult();

    // записывает объект для передачи в localStorage
    creatorStorageObjeck();
    localStorage.setItem('appDataStorage', JSON.stringify(appDataStorage));
    setCookeiOnStart();
  }

  reset() {
    this.removeExpInc();
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposit = false;
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.showResult();
    btnStart.style.display = 'inline-block';
    btnCancel.style.display = 'none';
    depositBank.style.display = 'none';
    depositAmount.style.display = 'none';
    depositPercent.style.display = 'none';
    depositCheck.checked = false;
    depositBank.value = '';
    incomePlus.style.display = 'inline-block';
    expensesPlus.style.display = 'inline-block';

    leftInputsText = data.querySelectorAll('[type="text"]');
    leftInputsText.forEach((item) => {
      item.value = '';
      item.removeAttribute('disabled');
    });
    periodSelect.value = '1';
    targetMonthValue.value = '';
    periodAmount.innerHTML = periodSelect.value;
    
    localStorage.clear();
    deleteAllCookies();
  }

  showResult() {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcSavedMoney();
    periodSelect.addEventListener('input', () => {
      incomePeriodValue.value = this.calcSavedMoney();
    });
  }

  addExpIncBlock(item) {
    const btn = item;
    let plus;
    let arr;
    if (item === 'expenses') {
      arr = expensesItems;
      plus = expensesPlus;
    }
    if (item === 'income') {
      arr = incomeItem;
      plus = incomePlus;
    }
    const clone = arr[0].cloneNode(true);
    clone.querySelector(`.${item}-title`).value = '';
    clone.querySelector(`.${item}-amount`).value = '';
    arr[0].parentNode.insertBefore(clone, plus);
    arr = document.querySelectorAll(`.${item}-items`);
    if (arr.length === 3) {
      plus.style.display = 'none';
    }
  }

  removeExpInc() {
    const allExp = document.querySelectorAll('.expenses-items');
    const allInc = document.querySelectorAll('.income-items');
    for (let i = 1; i < allExp.length; i++) {
      allExp[i].remove();
    }
    for (let i = 1; i < allInc.length; i++) {
      allInc[i].remove();
    }
  }

  getExpInc() {
    const func = (item) => {
      const startStr = item.className.split('-')[0];
      const itemTitle = item.querySelector(`.${startStr}-title`).value;
      const itemAmount = item.querySelector(`.${startStr}-amount`).value;
      if (itemTitle !== '' && itemAmount !== '') {
        this[startStr][itemTitle] = itemAmount;
      }
    };

    expensesItems.forEach(func);
    incomeItem.forEach(func);

    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }

  getAddExpInc() {
    const count = (item) => {
      let add;
      if (typeof item === 'string') {
        item = item.trim();
        add = this.addExpenses;
      } else {
        item = item.value.trim();
        add = this.addIncome;
      }
      if (item !== '') {
        add.push(item);
      }
    };

    additionalExpensesItem.value.split(',').forEach(count);
    additionalIncomeItem.forEach(count);
  }

  getExpenseMonth() {
    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
  }

  getBudget() {
    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth = Math.floor(this.budget + this.incomeMonth - this.expensesMonth + monthDeposit);
    this.budgetDay = Math.floor(this.budgetMonth / 30);
  }

  getTargetMonth()  {
    return Math.ceil(targetAmount.value / this.budgetMonth);
  }

  getStatusIncome() {
    if (this.budgetDay >= 1200) {
        return console.log('У вас высокий уровень дохода');
      } else if ((this.budgetDay < 1200) && (this.budgetDay >= 600)) {
        return console.log('У вас средний уровень дохода');
      } else if ((this.budgetDay >= 0) && (this.budgetDay < 600)) {
        return console.log('К сожалению у вас уровень дохода ниже среднего');
      } else {
        return console.log('Что-то пошло не так');
    }
  }

  getInfoDeposit() {
    if (this.deposit) {
      this.percentDeposit = depositPercent.value;
      this.moneyDeposit = depositAmount.value;
    }
  }

  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
  }

  changePercent() {
    const valueSelect = this.value;
    if (valueSelect === 'other') {
      depositPercent.style.display = 'inline-block';
      depositPercent.value = '';
    } else {
      depositPercent.value = valueSelect;
      depositPercent.style.display = 'none';
    }
  }

  depositHandler() {
    if (depositCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposit = true;
      depositBank.addEventListener('change', this.changePercent);
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositPercent.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      this.deposit = false;
      depositBank.removeEventListener('change', this.changePercent);
    }
  }

  eventsListeners() {
    btnStart.addEventListener('click', () => {

    let flag = 1;
    const inputs = document.querySelectorAll('input');
    const control = () => {
      inputs.forEach((item) => {
        if (item.placeholder === 'Наименование' && (re.exec(item.value) || item.value.trim() === '')) {
          item.placeholder = 'Неверный формат!';
          item.style.boxShadow = '10px 5px 5px red';
          flag = 0;
        }
          if (item.placeholder === 'Сумма' && (!reNum.exec(item.value) || item.value.trim() === '')) {
            if (item.classList[0] !== 'deposit-amount') {         // !!!!! незабыть про этот инпут скрытый!!!
          item.placeholder = 'Введите число!';
          item.style.boxShadow = '10px 5px 5px red';
          flag = 0;
        } }
      
      });
    
    };

    let clear = () => {
      inputs.forEach((item) => {
        if (item.placeholder === 'Неверный формат!') {
          item.placeholder = 'Наименование';
          item.style.boxShadow = '';
        }
        if (item.placeholder === 'Введите число!') {
          item.placeholder = 'Сумма';
          item.style.boxShadow = '';
        }
      }
      );
      
    };

    clear();
    flag = 1;
    control();

    if (flag) {
      appData.start.call(appData);
      leftInputsText = data.querySelectorAll('[type="text"]');
      console.log(leftInputsText);
      leftInputsText.forEach((item) => {
        item.setAttribute('disabled', '');
        btnCancel.style.display = 'inline-block';
        btnStart.style.display = 'none';
      });
    }
    });

  depositPercent.addEventListener('change', () => {
    if (!isNumber(depositPercent.value) || +depositPercent.value > 100) {
      alert('Введите корректное значение в поле проценты');
      btnStart.disabled = true;
    } else {
      btnStart.disabled = false;
    }
  });

  expensesPlus.addEventListener('click', () => {
    appData.addExpIncBlock('expenses');
  });
  incomePlus.addEventListener('click', () => {
    appData.addExpIncBlock('income');
  });
  periodSelect.addEventListener('input', () => {
    periodAmount.innerHTML = periodSelect.value;
  });

  btnCancel.addEventListener('click', () => {
    appData.reset();
  });

  depositCheck.addEventListener('change', this.depositHandler.bind(this));
  }
}

const appData = new AppData();

appData.eventsListeners();


let appDataStorage;


const creatorStorageObjeck = () => {
  appDataStorage = {};

  const additionalIncomeItem = document.querySelectorAll('.additional_income-item');
  let arradditionalIncomeItem = [];
  for (let i =0; i < additionalIncomeItem.length; i++) {
    arradditionalIncomeItem.push(additionalIncomeItem[i].value);
  }

  const additionalIncomeTitle = document.querySelectorAll('.income-title');
  let arrIncomiTitle = [];
  for (let i =0; i < additionalIncomeTitle.length; i++) {
    arrIncomiTitle.push(additionalIncomeTitle[i].value);
  }

  const additionalIncomeAmount = document.querySelectorAll('.income-amount');
  let arrIncomiAmount = [];
  for (let i =0; i < additionalIncomeAmount.length; i++) {
    arrIncomiAmount.push(additionalIncomeAmount[i].value);
  }

  const additionalExpensesTitle = document.querySelectorAll('.expenses-title');
  let arrExpensesTitle = [];
  for (let i =0; i < additionalExpensesTitle.length; i++) {
    arrExpensesTitle.push(additionalExpensesTitle[i].value);
  }

  const additionalExpensesAmount = document.querySelectorAll('.expenses-amount');
  let arrExpensesAmount = [];
  for (let i =0; i < additionalExpensesAmount.length; i++) {
    arrExpensesAmount.push(additionalExpensesAmount[i].value);
  }

  appDataStorage.salaryAmount = salaryAmount.value;
  appDataStorage.arrIncomiTitle = arrIncomiTitle;
  appDataStorage.arrIncomesAmount = arrIncomiAmount;
  appDataStorage.arrExpensesTitle = arrExpensesTitle;
  appDataStorage.arrExpensesAmount = arrExpensesAmount;
  appDataStorage.additionalIncomeItem = arradditionalIncomeItem;
  appDataStorage.additionalExpensesItem = additionalExpensesItem.value;
  appDataStorage.targetAmount = targetAmount.value;
  appDataStorage.periodSelect = periodSelect.value;
  appDataStorage.deposit = appData.deposit; 
  appDataStorage.depositBank = depositBank.value; 
  appDataStorage.depositAmount = depositAmount.value;
  appDataStorage.depositPercent = depositPercent.value;
  appDataStorage.budgetMonth = appData.budgetMonth;
  appDataStorage.budgetDay = appData.budgetDay;
  appDataStorage.expensesMonth = appData.expensesMonth;
  appDataStorage.additionalIncomeValue = appData.addIncome.join(', '); 
  appDataStorage.additionalExpensesValue = appData.addExpenses.join(', '); 
  appDataStorage.incomePeriodValue = incomePeriodValue.value;
  appDataStorage.targetMonthValue = targetMonthValue.value;
};

window.addEventListener('DOMContentLoaded', () => {
  appDataStorage = JSON.parse(localStorage.getItem('appDataStorage')) || 0;
    if (appDataStorage) {
        targetMonthValue.value = appDataStorage.targetMonthValue;
        incomePeriodValue.value = appDataStorage.incomePeriodValue;
        depositPercent.value = appDataStorage.depositPercent;
        depositAmount.value = appDataStorage.depositAmount;
        depositBank.value = appDataStorage.depositBank;
        periodSelect.value = appDataStorage.periodSelect;
        targetAmount.value = appDataStorage.targetAmount;
        additionalExpensesItem.value = appDataStorage.additionalExpensesItem;
        salaryAmount.value = appDataStorage.salaryAmount;
        budgetMonthValue.value = appDataStorage.budgetMonth;
        budgetDayValue.value = appDataStorage.budgetDay;
        expensesMonthValue.value = appDataStorage.expensesMonth;
        additionalIncomeValue.value = appDataStorage.additionalIncomeValue;
        additionalExpensesValue.value = appDataStorage.additionalExpensesValue;
        periodAmount.innerHTML = appDataStorage.periodSelect;
        appData.budgetMonth = appDataStorage.budgetMonth;
        periodSelect.addEventListener('input', () => {
        incomePeriodValue.value = appData.calcSavedMoney();
        });
        depositCheck.checked = appDataStorage.deposit;
        appData.depositHandler();
        for (let i = 0; i < additionalIncomeItem.length; i++) {
          additionalIncomeItem[i].value = appDataStorage.additionalIncomeItem[i];
        }

          // создаем блоки доходов и расходов после перезагрузки
        let count = 0;
        appDataStorage.arrIncomiTitle.forEach(item => {
          if (count > 0) {
            appData.addExpIncBlock('income');
          }
          count += 1;
        });
        const additionalIncomeTitle = document.querySelectorAll('.income-title');
        const additionalIncomeAmount = document.querySelectorAll('.income-amount');
        for (let i = 0; i < additionalIncomeTitle.length; i++) {
          additionalIncomeTitle[i].value = appDataStorage.arrIncomiTitle[i];
          additionalIncomeAmount[i].value = appDataStorage.arrIncomesAmount[i];
        }

        let count1 = 0;
        appDataStorage.arrExpensesTitle.forEach(item => {
          if (count1 > 0) {
            appData.addExpIncBlock('expenses');
          }
          count1 += 1;
        });
        const additionalExpensesTitle = document.querySelectorAll('.expenses-title');
        const additionalExpensesAmount = document.querySelectorAll('.expenses-amount');
        for (let i = 0; i < additionalExpensesTitle.length; i++) {
          additionalExpensesTitle[i].value = appDataStorage.arrExpensesTitle[i];
          additionalExpensesAmount[i].value = appDataStorage.arrExpensesAmount[i];
        }
        
      // appData.start.call(appData);
      leftInputsText = data.querySelectorAll('[type="text"]');
      leftInputsText.forEach((item) => {
        item.setAttribute('disabled', '');
        btnCancel.style.display = 'inline-block';
        btnStart.style.display = 'none';
      });
    }


    chechStorageCookie();

});


// функция создания кукки
const setCookei = (key, value, year, month, day, path, domain, secure) => {
  let cookieStr = key + '=' + value;
  if (year) {
    const expires = new Date(year, month-1, day);
    cookieStr += '; expires=' + expires.toGMTString();
  }

  cookieStr += path ? '; path=' + path : '';
  cookieStr += domain ? '; domain=' + domain : '';
  cookieStr += secure ? '; secure' : '';

  document.cookie = cookieStr;
};

const setCookeiOnStart = () => {
  for (let key in appDataStorage) {
    setCookei(key, appDataStorage[key], 2021, 12, 1);
  }
};


// функция удаления всех кукки
function deleteAllCookies() {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

// проверка соответствия локол сторедж и кукки
const chechStorageCookie = () => {
  if (appDataStorage) {
    let cookies = document.cookie.split(";");
    let keys = Object.keys(appDataStorage);

    if (cookies.length !== keys.length) {
      appData.reset();
    }
  }
};
