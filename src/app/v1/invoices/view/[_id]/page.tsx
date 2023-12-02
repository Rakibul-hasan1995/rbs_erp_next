'use client'
import ViewInvoice from '@/v1/pages/invoices/ViewInvoice'
import { InvoiceExpand } from '@/v1/utils/Types';
import { Axios } from '@/v1/utils/axios-config';
import { useParams } from 'next/navigation';
import * as React from 'react'

export default function page() {
  const activePage = useParams();
  const id = activePage._id || "";

  const [data, setData] = React.useState<InvoiceExpand>()



  React.useEffect(() => {
    if (id) {
      getInvoice()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  const getInvoice = async () => {
    try {
      const { data } = await Axios.get(`/api/v1/invoices/${id}?expand=true`)
      const invoice: InvoiceExpand = data.data
      setData(invoice)
    } catch (error) {
      console.log(error)
    }
  }




  return (
    <>
      {data && <ViewInvoice data={data} />}
    </>
  )
}
