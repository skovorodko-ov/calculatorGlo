'use strict';

let isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

let  btnStart = document.getElementById('start'),
    incomePlus = document.getElementsByTagName('button')[0],
    expensesPlus = document.getElementsByTagName('button')[1],
    checkBox = document.querySelector('#deposit-check'),
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
    expensesItems = document.querySelectorAll('.expenses-items'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    incomeItem = document.querySelectorAll('.income-items'),
    periodAmount = document.querySelector('.period-amount');

let appData = {
  income: {},
  incomeMonth: 0,
  addIncome: [],
  expenses: {},
  addExpenses: [],
  deposit: false,
  percentDeposit: 0,
  moneyDeposit: 0,
  budget: 0,
  budgetDay: 0,
  budgetMonth: 0,
  expensesMonth: 0,
  start: function() {
    appData.budget = +salaryAmount.value;

    appData.getExpenses();

    appData.getInfoDeposit();
    appData.getExpenseMonth();
    appData.getIncome();
    appData.getAddExpenses();
    appData.getAddIncome();
    appData.getBudget();
    appData.showResult();
  },
  showResult: function() {
    budgetMonthValue.value = appData.budgetMonth;
    budgetDayValue.value = appData.budgetDay;
    expensesMonthValue.value = appData.expensesMonth;
    additionalExpensesValue.value = appData.addExpenses.join(', ');
    additionalIncomeValue.value = appData.addIncome.join(', ');
    targetMonthValue.value = appData.getTargetMonth();
    incomePeriodValue.value = appData.calcSavedMoney();
    periodSelect.addEventListener('input', function() {
      incomePeriodValue.value = appData.calcSavedMoney();
    });
  },
  addExpensesBlock: function() {
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    cloneExpensesItem.querySelector('.expenses-title').value = '';
    cloneExpensesItem.querySelector('.expenses-amount').value = '';
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
    expensesItems = document.querySelectorAll('.expenses-items');
    if (expensesItems.length === 3) {
      expensesPlus.style.display = 'none';
    }
  },
  addIncomeBlock: function() {
    let cloneIncomeItem = incomeItem[0].cloneNode(true);
    cloneIncomeItem.querySelector('.income-title').value = '';
    cloneIncomeItem.querySelector('.income-amount').value = '';
    incomeItem[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
    incomeItem = document.querySelectorAll('.income-items');
    if (incomeItem.length === 3) {
      incomePlus.style.display = 'none';
    }
  },
  getExpenses: function() {
    expensesItems.forEach(function(item){
      let itemExpenses = item.querySelector('.expenses-title').value;
      let cashExpenses = item.querySelector('.expenses-amount').value;
      if (itemExpenses !== '' && cashExpenses !== '') {
        appData.expenses[itemExpenses] = cashExpenses;
      }
    });
  },
  getIncome: function() {
    incomeItem.forEach(function(item) {
      let itemIncomes = item.querySelector('.income-title').value;
      let cashIncomes = item.querySelector('.income-amount').value;
      if (itemIncomes !== '' && cashIncomes !== '') {
        appData.income[itemIncomes] = cashIncomes;
      }
    });
    for (let key in appData.income) {
      appData.incomeMonth += +appData.income[key];
    }
  },
  getAddExpenses: function() {
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item) {
      item = item.trim();
      if (item !== '') {
        appData.addExpenses.push(item);
      }
    });
  },
  getAddIncome: function() {
    additionalIncomeItem.forEach(function(item){
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        appData.addIncome.push(itemValue);
      }
    });
  },
  getExpenseMonth: function () {
    for (let key in appData.expenses) {
      appData.expensesMonth += +appData.expenses[key];
    }
  },
  getBudget: function () {
    appData.budgetMonth = Math.floor(appData.budget + appData.incomeMonth - appData.expensesMonth);
    appData.budgetDay = Math.floor(appData.budgetMonth / 30);
  },
  getTargetMonth: function () {
    return Math.ceil(targetAmount.value / appData.budgetMonth);
  },
  getStatusIncome: function () {
    if (appData.budgetDay >= 1200) {
        return console.log('У вас высокий уровень дохода');
      } else if ((appData.budgetDay < 1200) && (appData.budgetDay >= 600)) {
        return console.log('У вас средний уровень дохода');
      } else if ((appData.budgetDay >= 0) && (appData.budgetDay < 600)) {
        return console.log('К сожалению у вас уровень дохода ниже среднего');
      } else {
        return console.log('Что-то пошло не так');
    }
  },
  getInfoDeposit: function() {
    if (appData.deposit) {
      do {
        appData.percentDeposit = prompt('Какой годовой процент?', 10);
      }
      while (!isNumber(appData.percentDeposit) || appData.percentDeposit.trim() === '');
      do {
        appData.moneyDeposit = prompt('Какая сумма заложена', 10000);
      }
      while (!isNumber(appData.moneyDeposit) || appData.moneyDeposit.trim() === '');
    }
  },
  calcSavedMoney: function() {
    return appData.budgetMonth * periodSelect.value;
  }
};

const re = /[a-zA-Z0-9]/;
const reNum = /[0-9]/;

btnStart.addEventListener('click', function() {
  let flag = 1;
  let inputs = document.querySelectorAll('input');

  let control = function () {
    inputs.forEach(function(item) {
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

  let clear = function () {

      inputs.forEach(function(item){
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

  if (flag === 1) {
    appData.start();
  }
} );

expensesPlus.addEventListener('click', appData.addExpensesBlock);
incomePlus.addEventListener('click', appData.addIncomeBlock);
periodSelect.addEventListener('input', function() {
  periodAmount.innerHTML = periodSelect.value;
});