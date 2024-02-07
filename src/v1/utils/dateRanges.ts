import moment from "moment"


const df = 'yyyy-MM-DD'


const todayRange = { start_date: moment().format(df), end_date: moment().format(df) }
const thisWeekRange = { start_date: moment().startOf('week').subtract(1, 'days').format(df), end_date: moment().endOf('week').subtract(1, 'days').format(df) }
const thisMonthRange = { start_date: moment().startOf('month').format(df), end_date: moment().endOf('month').format(df) }
const thisYearRange = { start_date: moment().startOf('year').format(df), end_date: moment().endOf('year').format(df) }
const prevMonthRange = { start_date: moment().subtract(1, 'month').startOf('month').format(df), end_date: moment().subtract(1, 'month').endOf('month').format(df) }
const prevYearRange = { start_date: moment().subtract(1, 'year').startOf('year').format(df), end_date: moment().subtract(1, 'year').endOf('year').format(df) }





export { todayRange, thisWeekRange, thisMonthRange, thisYearRange, prevMonthRange, prevYearRange }