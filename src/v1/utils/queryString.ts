const getQueryStringParams = (query: any) => {
   return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query)
         .split('&')
         .reduce((params: any, param: any) => {
            const [key, value] = param.split('=');
            params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            return params;
         }, {}
         )
      : {}
};

const objToQueryString = function (obj: any) {
   const str: any = [];
   for (const p in obj)
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(p)) {
         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
   return str.join("&");
}



export { getQueryStringParams, objToQueryString }