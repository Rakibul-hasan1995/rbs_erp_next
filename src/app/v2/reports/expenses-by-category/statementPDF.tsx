/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { View, Text, Page, Font, Document, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';
import useWindowDimensions from '@/v1/hooks/useWindowDimension';

Font.register({
   family: 'Roboto',
   fonts: [
      {
         src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      },
      {
         src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf',
         fontStyle: 'italic'
      },
      {
         src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
         fontWeight: "bold",

         //  fontStyle: "no",
      },
   ],
});




export interface PageData {
   headerTitle: string;
   dateRange: string;
   rows: any[];
   total_formatted: string
}


export default function ExpenseSummeryByCategoryPDF({ pageData }: { pageData: PageData }) {


   return (
      <Document>
         <Page size="A4" style={styles.page} wrap={true}>
            <Text style={styles.subTitle} >Monapy Embroider</Text>
            <Text style={styles.title}>{pageData.headerTitle}</Text>
            <Text style={styles.dateRange} >{pageData.dateRange}</Text>

            <View style={styles.tableContainer}>

               <View style={[styles.row, { backgroundColor: 'whitesmoke'}]} >
                  <Text style={[styles.cell, { width: '50%', fontWeight: 800 }]}>Category Name</Text>
                  <Text style={[styles.cell, styles.textRight, { width: '50%', fontWeight: 800 }]}>Amount</Text>
               </View>

               {pageData.rows.map((item) => (
                  <View style={styles.row} >
                     <Text style={[styles.cell, { width: '50%' }]}>{item.account_name}</Text>
                     <Text style={[styles.cell, styles.textRight, { width: '50%' }]}>{item.amount}</Text>
                  </View>
               ))}
               <View style={[styles.row, { backgroundColor: 'whitesmoke' }]} >
                  <Text style={[styles.cell, { width: '50%',fontWeight: 800 }]}>Total</Text>
                  <Text style={[styles.cell, styles.textRight, { width: '50%', fontWeight: 800 }]}>{pageData.total_formatted}</Text>
               </View>


            </View>
            <Text style={{ paddingTop: '10px' }}  >Print at : {moment().format('DD-MMM-yy @  hh:mm:ss a')}</Text>
            <Text
               style={styles.pageNumber}
               render={({ pageNumber, totalPages }) => (
                  `${pageNumber} / ${totalPages}`
               )}
               fixed
            />
         </Page>
      </Document>
      // </PDFViewer>
   )
}

const styles = StyleSheet.create({
   page: {
      fontSize: 11,
      flexDirection: "column",
      padding: '40px',
   },

   title: {
      fontSize: 18,
      fontWeight: 200,
      textAlign: 'center',
      paddingBottom: '5px',
      fontFamily: 'Roboto'
   },
   subTitle: {
      fontSize: 13,
      fontWeight: 500,
      textAlign: 'center',
      paddingBottom: '5px',
      fontFamily: 'Roboto'
   },
   dateRange: {
      fontSize: 9,
      textAlign: 'center',
      paddingBottom: '10px',
      fontFamily: 'Roboto'
   },
   tableContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
   },
   row: {
      flexDirection: "row",
      alignItems: "center",
   },
   textCenter: {
      textAlign: "center"
   },
   textLeft: {
      textAlign: "left"
   },
   textRight: {
      textAlign: "right"
   },
   cell: {
      border: '0.2px',
      paddingVertical: '5px',
      paddingHorizontal: '9px',
      borderCollapse: "collapse",
   },
   width20: {
      width: "20%",
   },
   fontBold: {
      fontWeight: 'bold',
      fontFamily: 'Roboto'
   },
   pageNumber: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center'
   }
});

