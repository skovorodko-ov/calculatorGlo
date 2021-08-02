'use strict';

let money = 2500;
let income = 'фриланс';
let addExpenses = 'Такси, камуналка, телефон, интернет';
let deposit = true;
let mission = 1000000;
let period = 6;
let expenses1, expenses2, amount1, amount2, budgetMonth;
let budgetDay;

console.log(typeof money);
console.log(typeof income);
console.log(typeof true);
console.log(addExpenses.length);
console.log('Период равен ' + period + ' месяцев');
console.log('Цель заработать ' + mission + ' рублей');

addExpenses = addExpenses.toLocaleLowerCase();
addExpenses = addExpenses.split(', ');
console.log(addExpenses);

money = prompt('Ваш месячный доход?');

addExpenses = prompt('Перечислите возможные расходы за рассчитываемый период через запятую');

deposit = confirm('Есть ли у вас депозит в банке?');

expenses1 = prompt('Ввидите обязательную статью расходов?');
amount1 = prompt('Во сколько это обойдется?');
expenses2 = prompt('Ввидите обязательную статью расходов?');
amount2 = prompt('Во сколько это обойдется?');

budgetMonth = money - amount1 - amount2;
console.log('Бюджет на месяц: ', budgetMonth);

period = Math.ceil(mission / budgetMonth);
console.log('Цель будет достигнута за ' + period + ' месяцев');

budgetDay = Math.floor(budgetMonth / 30);
console.log('бюджет на день: ', budgetDay);

if (budgetDay >= 1200) {
  console.log('У вас высокий уровень дохода');
} else if ((budgetDay < 1200) && (budgetDay >= 600)) {
  console.log('У вас средний уровень дохода');
} else if ((budgetDay >= 0) && (budgetDay < 600)) {
  console.log('К сожалению у вас уровень дохода ниже среднего');
} else {
  console.log('Что-то пошло не так');
}