'use strict';

let isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

let money = 2500;
let income = 'фриланс';
let addExpenses;
let deposit = true;
let mission = 1000000;
let period = 6;
let amount1, amount2;
let budgetDay;
let expenses = [];

// let start = function() {
//   money = prompt('Ваш месячный доход?');
  
//   while (!isNumber(money)) {
//     money = prompt('Ваш месячный доход?');
//   }
// };

// start();

do {
  money = prompt('Ваш месячный доход?');
} while (!isNumber(money));

function showTypeOf(a) {
  return typeof(a);
}

console.log(showTypeOf(money));
console.log(showTypeOf(income));
console.log(showTypeOf(deposit));


addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую');

addExpenses = addExpenses.toLocaleLowerCase();
addExpenses = addExpenses.split(', ');

deposit = confirm('Есть ли у вас депозит в банке?');

console.log(addExpenses);

function getExpenseMonth() {
  let sum = 0;
  for (let i = 0; i < 2; i++) {

    expenses[i] = prompt('Введите обязательную статью расходов?');
    
    let pr;

    while (!isNumber(pr)) {
      pr = prompt('Во сколько это обойдется?');
    }

    sum += +pr;
    
  }
  console.log(expenses);
  return sum;
}

let expensesAmount = getExpenseMonth();

console.log('Расходы за месяц: ' + expensesAmount);



function getAccumulatedMonth(a, callback) {
  return +a - callback;
}

let accumulatedMonth = getAccumulatedMonth(money, expensesAmount);

function getTargetMonth(a, b) {
  return Math.ceil(a / b);
}

if (getTargetMonth(mission, accumulatedMonth) < 0) {
  console.log('Цель не будет достигнута');
} else {
  console.log('Срок достижения цели ' + getTargetMonth(mission, accumulatedMonth) + ' месяцев');
}

function getStatusIncome(a) {
  if (a >= 1200) {
    return console.log('У вас высокий уровень дохода');
  } else if ((a < 1200) && (a >= 600)) {
    return console.log('У вас средний уровень дохода');
  } else if ((a >= 0) && (a < 600)) {
    return console.log('К сожалению у вас уровень дохода ниже среднего');
  } else {
    return console.log('Что-то пошло не так');
  }
}

budgetDay = Math.floor(accumulatedMonth / 30);
console.log('Бюджет на день: ', budgetDay);

getStatusIncome(budgetDay);

