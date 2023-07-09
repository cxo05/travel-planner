import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { PlanWithItems } from './swr';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
})

interface Plan {
  plan: PlanWithItems
}

const PDFView = ({ plan }: Plan) => {
  console.log(plan)

  return (
    <PDFViewer className='w-full h-full'>
      <Document
        title={plan.title}
      >
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>{plan.title}</Text>
          </View>
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default PDFView