var moment = require('moment');

const limit = { 
	Sick: 		function(){ var l = 51; return l * 60;  }, 
	Vacation: 	function(y){ return (y>6 ? 102 : y>4 ? 85 : y>2 ? 68 : y>0 ? 51 : 0) * 60; } 
}

const calc = { 
	Late: 			function(m){ return m * 1; }, 
	Absence: 		function(m){ return m * 2; }, 
	calcMission: 	function(m){ return m * 1; }, 
	Sick: 			function(m, doc){ return doc ? 0 : m * 0.75; }
}


var getPeriod = function(assign){
	assign = moment(assign);

	var current = moment(moment(Date.now()).format('YYYY-MM-DD'));
	var YEAR = current.diff(assign, 'years'), TOTAL_MONTH = current.diff(assign, 'months'), MONTH = TOTAL_MONTH - (YEAR * 12);

	var first = moment(assign.format('YYYY-MM-01'));
	var last = first.add(-1, 'day').add(1, 'month');

	return { Y: YEAR, M: MONTH, D: current.diff(first.add(TOTAL_MONTH, 'month'), 'days') + last.date() - assign.date() };
}

var getQuota = function(assign){
	assign = moment(assign);

	var current = moment(moment(Date.now()).format('YYYY-12-31'));
	var YEAR = current.diff(assign, 'years'), TOTAL_MONTH = current.diff(assign, 'months'), MONTH = TOTAL_MONTH - (YEAR * 12);
	var DAY = moment(assign.format('YYYY-12-31')).diff(assign, 'days');
	return { Y: YEAR, M: MONTH, DY: DAY, D: 365-DAY };
}

var QuotaSick = function(quota) {
	return limit.Sick() * (quota.Y < 1 ? quota.DY / 365 : 1);
}

var QuotaVacation = function(q){
	return (limit.Vacation(q.Y) * (q.Y==1 || q.Y==3 || q.Y==5 ? q.DY/365 : 1) + (q.Y==3 || q.Y==5 ? limit.Vacation(q.Y-1)*q.D/365 : 0)).toFixed(2);
}

var date = '2012-04-29';
var User = getQuota(date);

// 246
console.log('User', getPeriod(date));
console.log('Quota', User);
console.log('Sick', QuotaSick(User), 'Vacation', QuotaVacation(User));
// if(quota.Y<1) {
// 	51*60*DAY/365
// } else {
// 	51*60
// }
