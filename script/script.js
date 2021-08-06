'use strict';


let isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

let money,
    start = function() {
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
  mission: 500000,
  period: 6,
  asking: function() {
    let addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую');
        appData.addExpenses = addExpenses.toLocaleLowerCase().split(', ');
        appData.deposit = confirm('Есть ли у вас депозит в банке?');
        for (let i = 0; i < 2; i++) {
          appData.expenses[prompt('Введите обязательную статью расходов?')] = +prompt('Во сколько это обойдется?');
        }
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
  }
};


appData.asking();
appData.getExpenseMonth();
appData.getBudget();

console.log('Расходы за месяц: ' + appData.expensesMonth);
console.log('Цель будет достигнута за ' + appData.getTargetMonth() + ' месяцев');
appData.getStatusIncome();

console.log('Наша программа включает включает в себя данные:');
for (let key in appData) {
  console.log(key + ': ' + appData[key]);
} 

