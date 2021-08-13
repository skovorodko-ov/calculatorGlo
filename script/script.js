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
    periodAmount = document.querySelector('.period-amount'),
    data = document.querySelector('.data'),
    leftInputsText = data.querySelectorAll('[type="text"]'),
    btnCancel = document.getElementById('cancel');

const re = /[a-zA-Z0-9]/,
  reNum = /[0-9]/;


const AppData = function() {
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
};

AppData.prototype.start = function() {
    this.budget = +salaryAmount.value;
    this.getExpenses();
    this.getInfoDeposit();
    this.getExpenseMonth();
    this.getIncome();
    this.getAddExpenses();
    this.getAddIncome();
    this.getBudget();
    this.showResult();
  };

AppData.prototype.reset = function() {
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
    leftInputsText = data.querySelectorAll('[type="text"]');
    leftInputsText.forEach(function(item) {
      item.value = '';
      item.removeAttribute('disabled');
    });
    periodSelect.value = '1';
    targetMonthValue.value = '';
    periodAmount.innerHTML = periodSelect.value;
  };

AppData.prototype.showResult = function() {
  const _this = this;
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = this.calcSavedMoney();
    periodSelect.addEventListener('input', function() {
      incomePeriodValue.value = _this.calcSavedMoney();
    });
  };

AppData.prototype.addExpensesBlock = function() {
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    cloneExpensesItem.querySelector('.expenses-title').value = '';
    cloneExpensesItem.querySelector('.expenses-amount').value = '';
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
    expensesItems = document.querySelectorAll('.expenses-items');
    if (expensesItems.length === 3) {
      expensesPlus.style.display = 'none';
    }
  };

AppData.prototype.addIncomeBlock = function() {
    let cloneIncomeItem = incomeItem[0].cloneNode(true);
    cloneIncomeItem.querySelector('.income-title').value = '';
    cloneIncomeItem.querySelector('.income-amount').value = '';
    incomeItem[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
    incomeItem = document.querySelectorAll('.income-items');
    if (incomeItem.length === 3) {
      incomePlus.style.display = 'none';
    }
  };

  AppData.prototype.getExpenses = function() {
    const _this = this;
    expensesItems.forEach(function(item){
      let itemExpenses = item.querySelector('.expenses-title').value;
      let cashExpenses = item.querySelector('.expenses-amount').value;
      if (itemExpenses !== '' && cashExpenses !== '') {
        _this.expenses[itemExpenses] = cashExpenses;
      }
    });
  };

AppData.prototype.getIncome = function() {
    const _this = this; 
    incomeItem.forEach(function(item) {
      let itemIncomes = item.querySelector('.income-title').value;
      let cashIncomes = item.querySelector('.income-amount').value;
      if (itemIncomes !== '' && cashIncomes !== '') {
        _this.income[itemIncomes] = cashIncomes;
      }
    });
    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  };

AppData.prototype.getAddExpenses = function() {
  const _this = this;
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item) {
      item = item.trim();
      if (item !== '') {
        _this.addExpenses.push(item);
      }
    });
  };

AppData.prototype.getAddIncome = function() {
  const _this = this;
    additionalIncomeItem.forEach(function(item){
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        _this.addIncome.push(itemValue);
      }
    });
  };

AppData.prototype.getExpenseMonth = function () {
    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
  };

AppData.prototype.getBudget = function () {
    this.budgetMonth = Math.floor(this.budget + this.incomeMonth - this.expensesMonth);
    this.budgetDay = Math.floor(this.budgetMonth / 30);
  };

AppData.prototype.getTargetMonth = function () {
    return Math.ceil(targetAmount.value / this.budgetMonth);
  };

AppData.prototype.getStatusIncome = function () {
    if (this.budgetDay >= 1200) {
        return console.log('У вас высокий уровень дохода');
      } else if ((this.budgetDay < 1200) && (this.budgetDay >= 600)) {
        return console.log('У вас средний уровень дохода');
      } else if ((this.budgetDay >= 0) && (this.budgetDay < 600)) {
        return console.log('К сожалению у вас уровень дохода ниже среднего');
      } else {
        return console.log('Что-то пошло не так');
    }
  };

AppData.prototype.getInfoDeposit = function() {
    if (this.deposit) {
      do {
        this.percentDeposit = prompt('Какой годовой процент?', 10);
      }
      while (!isNumber(this.percentDeposit) || this.percentDeposit.trim() === '');
      do {
        this.moneyDeposit = prompt('Какая сумма заложена', 10000);
      }
      while (!isNumber(this.moneyDeposit) || this.moneyDeposit.trim() === '');
    }
  };

AppData.prototype.calcSavedMoney = function() {
    return this.budgetMonth * periodSelect.value;
  };

AppData.prototype.eventsListeners = function() {
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
    appData.start.call(appData);
    leftInputsText.forEach(function(item) {
      item.setAttribute('disabled', '');
      btnCancel.style.display = 'inline-block';
      btnStart.style.display = 'none';
    });
  }
  });

  expensesPlus.addEventListener('click', appData.addExpensesBlock);
  incomePlus.addEventListener('click', appData.addIncomeBlock);
  periodSelect.addEventListener('input', function() {
  periodAmount.innerHTML = periodSelect.value;
  });

  btnCancel.addEventListener('click', function() {
  appData.reset();
  });
};

const appData = new AppData();

appData.eventsListeners();
