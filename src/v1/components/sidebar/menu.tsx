
import React from "react";
import { AiOutlineInbox } from 'react-icons/ai'
export const menu = [
   {
      icon: <AiOutlineInbox />,
      title: "Home",
      items: []
   },
   {
      icon: <AiOutlineInbox />,
      title: "Education",
      items: [
         {
            title: "Technical Analysis",
            items: [
               {
                  title: "The Dow Theory",
                  to: "/thedowtheory"
               },
               {
                  title: "Charts & Chart Patterns",
                  to: "/chart"
               },
               {
                  title: "Trend & Trend Lines",
                  to: "/trendlines"
               },
               {
                  title: "Support & Resistance",
                  to: "/sandr"
               }
            ]
         },
         {
            title: "Fundamental Analysis",
            items: [
               {
                  title: "The Dow Theory",
                  to: "/thedowtheory"
               },
               {
                  title: "Charts & Chart Patterns",
                  to: "/chart"
               },
               {
                  title: "Trend & Trend Lines",
                  to: "/trendlines"
               },
               {
                  title: "Support & Resistance",
                  to: "/sandr"
               }
            ]
         },
         {
            title: "Elliot Wave Analysis",
            items: [
               {
                  title: "The Dow Theory",
                  to: "/thedowtheory"
               },
               {
                  title: "Charts & Chart Patterns",
                  to: "/chart"
               },
               {
                  title: "Trend & Trend Lines",
                  to: "/trendlines"
               },
               {
                  title: "Support & Resistance",
                  to: "/sandr"
               }
            ]
         }
      ]
   },
   {
      icon: <AiOutlineInbox />,
      title: "Options"
   },
   {
      icon: <AiOutlineInbox />,
      title: "Blog"
   }
];
