'use strict';

let isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const btnStart = document.getElementById('start');
const btnIncomeAdd = document.getElementsByTagName('button')[0];
const btnExpensesAdd = document.getElementsByTagName('button')[1];
const checkBox = document.querySelector('#deposit-check');
const additionalIncomeItem = document.querySelectorAll('.additional_income-item');
const budgetMonthValue = document.getElementsByClassName('budget_month-value');
const budgetDayValue = document.getElementsByClassName('budget_day-value');
const expensesMonthValue = document.getElementsByClassName('expenses_month-value');
const additionalIncomeValue = document.getElementsByClassName('additional_income-value');
const additionalExpensesValue = document.getElementsByClassName('additional_expenses-value');
const incomePeriodValue = document.getElementsByClassName('income_period-value');
const targetMonthValue = document.getElementsByClassName('target_month-value');
const salaryAmount = document.querySelector('.salary-amount');
const incomeTitle = document.querySelector('.income-title');
const incomeAmount = document.querySelector('.income-amount');
const expensesTitle = document.querySelector('.expenses-title');
const expensesAmount = document.querySelector('.expenses-amount');
const additionalExpensesItem = document.querySelector('.additional_expenses-item');
const targetAmount = document.querySelector('.target-amount');
const periodSelect = document.querySelector('.period-select');


let money;
let start = function() {
      do {
        money = prompt('Ваш месячный доход?', 50000);
      }
      while (!isNumber(money) || money.trim() === '');
    };

start();

let appData = {
  income: {},
  addIncome: [],
  expenses: {},
  addExpenses: [],
  deposit: false,
  percentDeposit: 0,
  moneyDeposit: 0,
  mission: 500000,
  period: 6,
  asking: function() {

    if (confirm('Есть ли у вас дополнительный источник заработка?')) {
      let answer;
      let itemIncome = function() {
        do {
          answer = prompt('Какой у вас дополнительный заработок?', 'таксую');
        }
        while (isNumber(answer) || answer.trim() === '');
        return answer;
      };

      let cashIncome = function() {
        do {
          answer = prompt('Сколько в месяц вы на этом зарабатываете?', 10000);
        }
        while (!isNumber(answer) || answer.trim() === '');
        return answer;
      };

      appData.income[itemIncome()] = cashIncome();
    }

    let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую');
        appData.addExpenses = addExpenses.toLocaleLowerCase().split(',');

        for (let i = 0; i < 2; i++) {
          let answer1, answer2;
          do {
            answer1 = prompt('Введите обязательную статью расходов?');
          }
          while (isNumber(answer1) || answer1.trim() === '');
          do {
            answer2 = prompt('Во сколько это обойдется?');
          }
          while (!isNumber(answer2) || answer2.trim() === '');

          appData.expenses[answer1] = +answer2;
        }

        appData.deposit = confirm('Есть ли у вас депозит в банке?');
  },
  budget: +money,
  budgetDay: 0,
  budgetMonth: 0,
  expensesMonth: 0,
  getExpenseMonth: function () {
    for (let key in appData.expenses) {
      appData.expensesMonth += appData.expenses[key];
    }
  },
  getBudget: function () {
    appData.budgetMonth = Math.floor(appData.budget - appData.expensesMonth);
    appData.budgetDay = Math.floor(appData.budgetMonth / 30);
  },
  getTargetMonth: function () {
    return Math.ceil(appData.mission / appData.budgetMonth);
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
    return appData.budgetMonth * appData.period;
  }
};


appData.asking();
appData.getInfoDeposit();
appData.getExpenseMonth();
appData.getBudget();

console.log('Расходы за месяц: ' + appData.expensesMonth);
console.log('Цель будет достигнута за ' + appData.getTargetMonth() + ' месяцев');
appData.getStatusIncome();

console.log('Наша программа включает включает в себя данные:'); 
for (let key in appData) {
  console.log(key + ': ' + appData[key]);
} 

console.log(appData.addExpenses.map(function (item) {
  return (item.charAt(0).toUpperCase() + item.slice(1));
}).join(', '));

