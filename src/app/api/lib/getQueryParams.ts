export const getQueryParams = (url: any, name: string, defaultValue: any) => {
   const urls = new URL(url as string)
   const searchParams = new URLSearchParams(urls.search)
   const token = searchParams.get(name)

   if (token) {
      if (name == 'expand') {
         return Boolean(token == 'true')
      }
      return token
   } else {
      return defaultValue
   }
}