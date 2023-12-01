/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'

import { PDFViewer, View, Text, Page, Font, Document, StyleSheet } from '@react-pdf/renderer';

import moment from 'moment';
import { useParams } from 'next/navigation';
import { Axios } from '@/v1/utils/axios-config';
import { numberWithCommas } from '@/v1/utils/numberFormater';
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



export default function CustomerStatement() {
   const activePage = useParams()
   const id = activePage._id


   const [data, setData] = React.useState<any>()

   React.useEffect(() => {
      fetch()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])


   const fetch = async () => {
      try {

         const { data: st } = await Axios.get(`/api/v1/users/statement/${id}`)
         setData(st.data)
         console.log(st.data)

      } catch (error) {
         console.log(error)
      }
   }

   const tableHeader = ["Date", "Particulars", "Page", "Debit", "Credit"]
   const tableFooter = ["-", "Total", '-', numberWithCommas(data?.debitAmount), numberWithCommas(data?.creditAmount)]
   const tableDueRow = ["-", "-", "Deu", '-', numberWithCommas(data?.deuAmount)]

   const { height } = useWindowDimensions();

   return (
      <PDFViewer width="100%" height={height || '100vh'}>
         <Document>
            <Page size="A4" style={styles.page} wrap={true}>
               <Text style={styles.title} >Monapy Embroider</Text>
               <Text style={styles.subTitle}>Sub Ladger For: {data?.customer}</Text>
               <View style={styles.tableContainer}>
                  <TableHeader cells={tableHeader} />
                  {data?.data?.map((item: { page: React.Key | null | undefined; }) =>
                     (<TableRow key={item.page} item={item} />)
                  )}
                  <TableHeader cells={tableFooter} />
                  <TableHeader cells={tableDueRow} />
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
      </PDFViewer>
   )
}

const styles = StyleSheet.create({
   page: {
      fontSize: 11,
      flexDirection: "column",
      padding: '40px',
   },
   subTitle: {
      paddingVertical: '10px',
      fontWeight: 'bold',
      fontFamily: 'Roboto'
   },
   title: {
      fontSize: 25,
      fontWeight: 800,
      textAlign: 'center',
      paddingBottom: '10px',
      fontFamily: 'Roboto'
   },
   tableContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
   },
   tableHeader: {
      backgroundColor: 'whitesmoke',
      width: "20%",
      fontWeight: 'bold',
      fontFamily: 'Roboto',
      textAlign: 'center'
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






const TableRow = ({ item }: { item: any }) => {
   return (
      <View style={styles.row} >
         {item.date ?
            <Text style={[styles.cell, styles.width20]}>{moment(item.date).format("DD-MMM-yy")}</Text> :
            <Text style={[styles.cell, styles.textCenter, styles.width20]}>{'---'}</Text>}
         <Text style={[styles.cell, styles.width20]}>{item.particulars}</Text>
         <Text style={[styles.cell, styles.width20]}>{item.page}</Text>
         <Text style={[styles.cell, styles.width20, styles.textRight]}>{numberWithCommas(item.debit)}</Text>
         <Text style={[styles.cell, styles.width20, styles.textRight]}>{numberWithCommas(item.credit)}</Text>
      </View>
   )
};
const TableHeader = ({ cells }: { cells: string[] }) => {

   return (
      <View style={styles.row} >
         {cells.map((item: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined) => (
            <Text key={item?.toLocaleString()}
               style={[styles.cell, styles.tableHeader]}
            >
               {item}
            </Text>
         ))}
      </View>
   )
};
