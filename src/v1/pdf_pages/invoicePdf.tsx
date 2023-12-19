/* eslint-disable react-hooks/exhaustive-deps */

import { View, Text, Page, Font, Document, StyleSheet, Image } from '@react-pdf/renderer';

import moment from 'moment';

// import FontRobotoRegular from '../fonts/Roboto/Roboto-Regular.ttf'
// import FontRobotoItalic from '../fonts/Roboto/Roboto-Italic.ttf'
// import FontRobotoBold from '../fonts/Roboto/Roboto-Bold.ttf'


import { ToWords } from 'to-words';
import { numberWithCommas } from '../utils/numberFormater';
import { InvoiceExpand, InvoiceExpandItem } from '../utils/Types';

const toWords = new ToWords({
   localeCode: "en-BD",
   converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
   },
});



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


const styles = StyleSheet.create({
   page: {
      fontSize: 11,
      flexDirection: "column",
      // padding: '40px',
   },
   header: {
      position: 'absolute',
      top: 20,
      width: "100%"
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
      width: "100%"
   },
   tableHeader: {
      backgroundColor: 'whitesmoke',
      width: "14.26%",
      fontWeight: 'bold',
      fontFamily: 'Roboto',
      textAlign: 'center'
   },
   row: {
      flexDirection: "row",
      alignItems: "center",
      height: 'auto',
      width: '100%'
   },
   headerRow: {
      flexDirection: "row",
      alignItems: "center",

      width: '100%'
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
      border: '0.3px',
      paddingVertical: '5px',
      paddingHorizontal: '9px',
      borderCollapse: "collapse",
      fontSize: 9
   },
   img: {
      // border: '0.2px',
      // paddingVertical: '5px',
      // paddingHorizontal: '5px',
      // borderCollapse: "collapse",
      height: 30,
      width: '100%',
      marginVertical: "auto"
   },
   width20: {
      width: "14.28%",
      height: 'auto',
   },
   fontBold: {
      fontWeight: 'bold',
      fontFamily: 'Roboto'
   },
   fontItalic: {
      // fontWeight: 'bold',
      fontStyle: 'italic',
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





// eslint-disable-next-line react-refresh/only-export-components
function InvoiceDoc({ showHeader = true, pageData }: { showHeader: boolean, pageData: InvoiceExpand }) {

   return (
      <Document>
         {pageData &&
            <Page size="A4" style={styles.page} wrap={true}>
               <View style={{ height: 100 }}>
                  {showHeader && <View style={styles.header}>
                     <Image src={'https://res.cloudinary.com/dbu76a0wo/image/upload/v1663769776/padTop_yluxqh.png'} />
                  </View>}
               </View>
               <View style={{ padding: '40px' }}>

                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                     <View style={{ width: '100%' }}>
                        <Text>Bill To.</Text>
                        <Text style={styles.subTitle}>{pageData?.customer?.user_name}</Text>
                        <Text style={{ width: "40%" }}>{pageData?.customer?.contact_details.address}</Text>
                     </View>
                     <View style={{ width: '35%' }}>
                        <Text>Invoice Date : {moment(pageData?.date).format("DD-MMM-YY")}</Text>
                        <Text style={{ paddingVertical: "5px" }}>Invoice No    :  {pageData?.invoice_no}</Text>
                        <Text>Bill No           :  {pageData?.customer_bill_no}</Text>

                     </View>
                  </View>

                  <Text style={styles.subTitle}>Sub Bill For Embroidery Work</Text>
                  <View style={styles.tableContainer}>
                     <View style={styles.headerRow} >
                        <Text style={[styles.cell, styles.tableHeader, { width: '24%' }]}>Style</Text>
                        <Text style={[styles.cell, styles.tableHeader, { width: '10%' }]}>Design</Text>
                        <Text style={[styles.cell, styles.tableHeader, { width: '14%' }]}>CH-No</Text>
                        <Text style={[styles.cell, styles.tableHeader, { width: '12%' }]}>Qty</Text>
                        <Text style={[styles.cell, styles.tableHeader, { width: '12%' }]}>Rate</Text>
                        <Text style={[styles.cell, styles.tableHeader, { width: '14%' }]}>Total(USD)</Text>
                        <Text style={[styles.cell, styles.tableHeader, { width: '14%' }]}>Total(BDT)</Text>
                     </View>
                     {pageData?.items ? pageData?.items?.map((item: any) =>
                     (<View key={item._id} style={{ flexDirection: 'row' }} >
                        <Text style={[styles.cell, { width: '24%' }]}>{item.program_name} {item.order_name}</Text>
                        <View style={[styles.cell, { width: '10%' }]}>
                           <Image
                              style={styles.img}
                              src={item.cover_photo.href} />
                        </View>
                        <Text style={[styles.cell, styles.textRight, { width: '14%' }]}>{item.challan_no}</Text>
                        <Text style={[styles.cell, styles.textCenter, { width: '12%' }]}>{item.qty}</Text>
                        <Text style={[styles.cell, styles.textRight, { width: '12%' }]}>{item.currency} {numberWithCommas(item.rate)}</Text>
                        <Text style={[styles.cell, styles.textRight, { width: '14%' }]}>{numberWithCommas(item.totalUsd)}</Text>
                        <Text style={[styles.cell, styles.textRight, { width: '14%' }]}>{numberWithCommas(item.totalBdt)}</Text>
                     </View>)
                     ) : <></>}

                     {pageData?.discount > 0 ? <View style={{ flexDirection: 'row' }} >
                        <Text style={[styles.cell, styles.textCenter, { width: '60%' }]}>Discount</Text>
                        <Text style={[styles.cell, styles.textCenter, { width: '26%' }]}>{numberWithCommas(pageData?.discount)}%</Text>
                        <Text style={[styles.cell, styles.textRight, { width: '14%' }]}>-  {pageData?.discountAmount}</Text>
                     </View> : <></>}

                     <View style={styles.headerRow} >
                        <Text style={[styles.cell, styles.tableHeader, { width: '48%' }]} >Total</Text>
                        <Text style={[styles.cell, styles.tableHeader, { width: '12%' }]} > {pageData?.totalQty}</Text>
                        <Text style={[styles.cell, styles.tableHeader, { width: '12%' }]} > --</Text>
                        <Text style={[styles.cell, styles.tableHeader, styles.textRight, { width: '14%' }]} >{numberWithCommas(pageData?.totalAmountUSD)}</Text>
                        <Text style={[styles.cell, styles.tableHeader, styles.textRight, { width: '14%' }]} >{numberWithCommas(pageData?.totalAmountBDT)}</Text>
                     </View>

                  </View>
                  <Text style={{ paddingTop: '10px', fontFamily: 'Roboto' }}>In Word : {toWords.convert(Number(pageData?.totalAmountBDT || 0))}</Text>
                  <Text style={{ paddingTop: '5px', fontFamily: 'Roboto' }}>Remarks: {pageData?.remarks}</Text>

                  <Text style={[styles.fontItalic, { fontSize: '9px', paddingTop: '35px' }]}>
                     Early Payment Will Be Appreciated
                  </Text>
                  <Text style={[styles.fontItalic, { fontSize: '9px', paddingTop: '35px' }]}>
                     Thanks
                  </Text>
                  <View style={{ paddingTop: '50px', paddingHorizontal: '20px', flexDirection: 'row', justifyContent: 'space-between' }}>
                     <Text>Received By</Text>
                     <Text>For: Monapy Embroidery</Text>
                  </View>
               </View>
               {showHeader && <Text
                  style={styles.pageNumber}
                  fixed
               >A-149, A-150, BSCIC I/A, Fatullah, Narayanganj-1420
               </Text>}
            </Page>}
      </Document>
   )
}
export default InvoiceDoc


