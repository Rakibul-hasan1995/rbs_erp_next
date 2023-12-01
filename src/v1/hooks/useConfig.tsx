import * as React from 'react'
import { Axios } from '../utils/axios-config'

export default function useConfig() {
   const [config, setConfig] = React.useState<any>()
   React.useEffect(() => {
      fetchConfigs()
   }, [])


   const fetchConfigs = async () => {
      try {
         const configs: string = window.localStorage.getItem('configs') || ''
         if (!configs.length) {
            const { data } = await Axios.get('/api/v1/configs/all')
            window.localStorage.setItem('configs', JSON.stringify(data))
            setConfig(data)
         } else {
            setConfig(JSON.parse(configs))
         }
      } catch (error) {
         console.log(error)
      }
   }



   return { config }
}
