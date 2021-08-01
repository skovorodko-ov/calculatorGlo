let money = 2500;
let income = 'фриланс';
let addExpenses = 'Такси, камуналка, телефон, интернет';
let deposit = true;
let mission = 1000000;
let period = 6;
let budgetDay = money / 30;

console.log(typeof money);
console.log(typeof income);
console.log(typeof true);
console.log(addExpenses.length);
console.log('Период равен ' + period + ' месяцев');
console.log('Цель заработать ' + mission + ' рублей');

addExpenses = addExpenses.toLocaleLowerCase();
addExpenses = addExpenses.split(', ');
console.log(addExpenses);

console.log('budgetDay: ', budgetDay);