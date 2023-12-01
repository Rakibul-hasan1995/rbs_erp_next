import { useState, useEffect } from 'react';

export default function useWindowDimensions() {
   const isClient = typeof window === 'object'; // Check if window is defined

   function getWindowDimensions() {
      return {
         width: isClient ? window.innerWidth : null,
         height: isClient ? window.innerHeight : null,
      };
   }

   const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions);

   useEffect(() => {
      if (isClient) {
         const handleResize = () => {
            setWindowDimensions(getWindowDimensions());
         };

         window.addEventListener('resize', handleResize);

         return () => {
            window.removeEventListener('resize', handleResize);
         };
      }

      // Cleanup for the case when the component is unmounted before the window is defined
      // This is not strictly necessary but can help avoid potential issues
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isClient]);

   return windowDimensions;
}
