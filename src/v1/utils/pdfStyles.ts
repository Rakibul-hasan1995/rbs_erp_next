import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
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

