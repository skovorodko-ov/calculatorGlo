'use strict';

const isNumber = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const  btnStart = document.getElementById('start'),
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
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    periodAmount = document.querySelector('.period-amount'),
    data = document.querySelector('.data'),
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
    this.getExpenses();
    this.getInfoDeposit();
    this.getExpenseMonth();
    this.getIncome();
    this.getAddExpenses();
    this.getAddIncome();
    this.getBudget();
    this.showResult();
  }

  reset() {
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
    leftInputsText.forEach((item) => {
      item.value = '';
      item.removeAttribute('disabled');
    });
    periodSelect.value = '1';
    targetMonthValue.value = '';
    periodAmount.innerHTML = periodSelect.value;
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

  addExpensesBlock() {
  const cloneExpensesItem = expensesItems[0].cloneNode(true);
    cloneExpensesItem.querySelector('.expenses-title').value = '';
    cloneExpensesItem.querySelector('.expenses-amount').value = '';
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
    expensesItems = document.querySelectorAll('.expenses-items');
    if (expensesItems.length === 3) {
      expensesPlus.style.display = 'none';
    }
  }

  addIncomeBlock() {
    const cloneIncomeItem = incomeItem[0].cloneNode(true);
    cloneIncomeItem.querySelector('.income-title').value = '';
    cloneIncomeItem.querySelector('.income-amount').value = '';
    incomeItem[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
    incomeItem = document.querySelectorAll('.income-items');
    if (incomeItem.length === 3) {
      incomePlus.style.display = 'none';
    }
  }

  getExpenses() {
    expensesItems.forEach((item) => {
      const itemExpenses = item.querySelector('.expenses-title').value;
      const cashExpenses = item.querySelector('.expenses-amount').value;
      if (itemExpenses !== '' && cashExpenses !== '') {
        this.expenses[itemExpenses] = cashExpenses;
      }
    });
  }

  getIncome() {
    incomeItem.forEach((item) => {
      const itemIncomes = item.querySelector('.income-title').value;
      const cashIncomes = item.querySelector('.income-amount').value;
      if (itemIncomes !== '' && cashIncomes !== '') {
        this.income[itemIncomes] = cashIncomes;
      }
    });
    for (let key in this.income) {
      this.incomeMonth += +this.income[key];
    }
  }

  getAddExpenses() {
    const addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach((item) => {
      item = item.trim();
      if (item !== '') {
        this.addExpenses.push(item);
      }
    });
  }

  getAddIncome() {
    additionalIncomeItem.forEach((item) => {
      const itemValue = item.value.trim();
      if (itemValue !== '') {
        this.addIncome.push(itemValue);
      }
    });
  }

  getExpenseMonth() {
    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
  }

  getBudget() {
    this.budgetMonth = Math.floor(this.budget + this.incomeMonth - this.expensesMonth);
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
      do {
        this.percentDeposit = prompt('Какой годовой процент?', 10);
      }
      while (!isNumber(this.percentDeposit) || this.percentDeposit.trim() === '');
      do {
        this.moneyDeposit = prompt('Какая сумма заложена', 10000);
      }
      while (!isNumber(this.moneyDeposit) || this.moneyDeposit.trim() === '');
    }
  }

  calcSavedMoney() {
    return this.budgetMonth * periodSelect.value;
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

    if (flag === 1) {
      appData.start.call(appData);
      leftInputsText.forEach((item) => {
        item.setAttribute('disabled', '');
        btnCancel.style.display = 'inline-block';
        btnStart.style.display = 'none';
      });
    }
    });

  expensesPlus.addEventListener('click', appData.addExpensesBlock);
  incomePlus.addEventListener('click', appData.addIncomeBlock);
  periodSelect.addEventListener('input', () => {
    periodAmount.innerHTML = periodSelect.value;
  });

  btnCancel.addEventListener('click', () => {
    appData.reset();
  });
  }
}

const appData = new AppData();

appData.eventsListeners();
