import axios from "axios";
export interface ApiResponse {
   code: number;
   data: any;
   message: string
}

// export const serverUrl = dev ? 'http://localhost:4000' : 'https://rbs-erp-server.vercel.app';
export const serverUrl = '/'

export const Axios = axios.create({
   baseURL: serverUrl,
   headers: {
      'Content-Type': 'application/json',
   },
});

Axios.interceptors.request.use(async (config) => {
   const token = localStorage.getItem('access_token');

   // Check if the token is available and not expired
   if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
   }

   return config;
});

Axios.interceptors.response.use(undefined, error => {
   const statusCode = error.response ? error.response.status : null;

   if (statusCode === 401) {
      // Get the history object from React Router
      console.log(error)
      // redirect("/auth/signin");
      window.location.replace('/api/auth/signin')

   }

   return Promise.reject(error);
});

// Add response interceptor to handle token refresh if needed
