


export const numberWithCommas = (x: number | any) => {
   const d = x?.toFixed(2) || 0
   return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export const formatBDTCurrency = (amount: number): string => {
   return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
   }).format(amount);
}