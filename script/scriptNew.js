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

    if (flag === 1) {
      appData.start.call(appData);
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
