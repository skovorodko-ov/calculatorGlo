'use strict';

let money = 2500;
let income = 'фриланс';
let addExpenses = 'Такси, камуналка, телефон, интернет';
let deposit = true;
let mission = 1000000;
let period = 6;
let expenses1, expenses2, amount1, amount2;
let budgetDay;

function showTypeOf(a) {
  return typeof(a);
}

console.log(showTypeOf(money));
console.log(showTypeOf(income));
console.log(showTypeOf(deposit));

money = prompt('Ваш месячный доход?', 20000);
addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую', 'Свет, бензин, вода');

addExpenses = addExpenses.toLocaleLowerCase();
addExpenses = addExpenses.split(', ');

deposit = confirm('Есть ли у вас депозит в банке?');

expenses1 = prompt('Ввидите обязательную статью расходов?', 'автомобиль');
amount1 = prompt('Во сколько это обойдется?', '5000');
expenses2 = prompt('Ввидите обязательную статью расходов?', 'учеба');
amount2 = prompt('Во сколько это обойдется?', '5000');

function getExpenseMonth(a, b) {
  return (+a) + (+b);
}

console.log('Расходы за месяц: ' + getExpenseMonth(amount1, amount2));

console.log(addExpenses);

function getAccumulatedMonth(a, callback) {
  return +a - callback;
}

let accumulatedMonth = getAccumulatedMonth(money, getExpenseMonth(amount1, amount2));

function getTargetMonth(a, b) {
  return Math.ceil(a / b);
}

console.log('Срок достижения цели ' + getTargetMonth(mission, accumulatedMonth) + ' месяцев');

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

