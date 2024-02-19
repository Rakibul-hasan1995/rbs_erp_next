
export type CustomerBalanceSummaryApiResponse = {
   data: {
      _id: string;
      name: string;
      payment_amount: number;
      settlement_amount: number;
      invoice_amount: number;

      payment_amount_formatted: string;
      settlement_amount_formatted: string;
      invoice_amount_formatted: string;
      closing_amount: number;
      closing_amount_formatted: string
   }[];
   code: number;

}