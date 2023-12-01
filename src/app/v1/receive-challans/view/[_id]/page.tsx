'use client';
import ViewReceiveChallan from '@/v1/pages/challan/ViewReceiveChallan'
import { Challan } from '@/v1/utils/Types';
import { _arrSum } from '@/v1/utils/arrSum';
import { Axios } from '@/v1/utils/axios-config';
import { useParams } from 'next/navigation';
import React from 'react'

export default function page() {
  const activePage = useParams();
  const id = activePage._id || "";

  const [data, setData] = React.useState<Challan>()

  React.useEffect(() => {
    if (id) {
      getInvoice()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  const getInvoice = async () => {
    try {
      const { data } = await Axios.get(`/api/v1/receive-challan/${id}?expand=true`)
      const resData = data.data
      const qty = _arrSum(resData.items || [], 'qty')
      const emb_reject_qty = _arrSum(resData.items || [], 'emb_reject_qty')
      const fabric_reject_qty = _arrSum(resData.items || [], 'fabric_reject_qty')

      let challan = {
        ...resData,
        total: {
          qty,
          emb_reject_qty,
          fabric_reject_qty
        }
      }
      setData(challan)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>{data && <ViewReceiveChallan title='Receive Challan' data={data} />}</>
  )
}
