import moment from "moment";
import * as React from "react";
const df = 'yyyy-MM-DD'

const useAccountDetails = () => {
   const todayRange = { label: 'Today', value: { start_date: moment().startOf('D').toISOString(), end_date: moment().endOf('D').toISOString() } }
   const [dateRange, setDateRange] = React.useState(todayRange)
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const [dateRangeAnchor, setDateRangeAnchor] = React.useState<null | HTMLElement>(null);


   const menuItems: { label: string, value: any }[] = [
      { label: 'Today', value: moment().format(df) },
      { label: 'This Week', value: { start_date: moment().startOf('week').subtract(1, 'days').format(df), end_date: moment().endOf('week').subtract(1, 'days').format(df) } },
      { label: 'This Month', value: { start_date: moment().startOf('month').format(df), end_date: moment().endOf('month').format(df) } },
      { label: 'This Year', value: { start_date: moment().startOf('year').format(df), end_date: moment().endOf('year').format(df) } },
      { label: 'Previous Month', value: { start_date: moment().subtract(1, 'month').startOf('month').format(df), end_date: moment().subtract(1, 'month').endOf('month').format(df) } },
      { label: 'Previous Year', value: { start_date: moment().subtract(1, 'year').startOf('year').format(df), end_date: moment().subtract(1, 'year').endOf('year').format(df) } },
      { label: 'Custom', value: 'custom' },
   ]


   return {
      dateRange,
      anchorEl,
      dateRangeAnchor,
      menuItems
   }
}

export default useAccountDetails

