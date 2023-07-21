import React, { Fragment } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { PlanWithItems } from './swr';
import TableHeader from '../components/Pdf/tableHeader';

import dayjs from 'dayjs'

const borderColor = '#90e5fc'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    fontSize: 11
  },
  title: {
    color: '#61dafb',
    letterSpacing: 2,
    fontSize: 25,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    border: 1,
    borderColor: borderColor
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: 1,
    borderColor: borderColor
  },
  date: {
    width: '20%',
    padding: '5px 5px',
  },
  time: {
    width: "25%",
    padding: "5px 4px",
    borderColor: borderColor,
    borderRightWidth: 1,
    borderLeftWidth: 1
  },
  event: {
    width: '75%',
    padding: "5px 5px",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  }
})

interface Plan {
  plan: PlanWithItems
}

const PDFView = ({ plan }: Plan) => {
  const groupByDate = plan.ScheduledItems
    .reduce((result, currentItem) => {
      const objKey = dayjs(currentItem.startDate).format("ddd MMM DD")
      if (result[objKey]) {
        result[objKey].push(currentItem);
      } else {
        result[objKey] = [currentItem];
      }
      return result;
    }, {} as { [key: string]: typeof plan.ScheduledItems })

  let rows = [];

  for (const [key, value] of Object.entries(groupByDate)) {
    let row = (
      <View style={styles.row} key={key}>
        <Text style={styles.date}>{key}</Text>
        <View style={{
          flexDirection: "column",
          width: "80%"
        }}>
          {
            value.reverse().map((item) => {
              const startTime = new Date(item.startDate).toLocaleTimeString([], { timeStyle: "short" })
              const endTime = new Date(item.endDate).toLocaleTimeString([], { timeStyle: "short" })
              return (
                <View
                  key={item.id}
                  style={styles.row}
                >
                  <Text style={styles.time}>{startTime} - {endTime}</Text>
                  <Text style={styles.event}>{item.Item.name}</Text>
                </View>
              )
            })
          }
        </View>
      </View>
    )
    rows.push(row)
  }

  return (
    <PDFViewer className='w-full h-full'>
      <Document title={plan.title}>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {/* PDF Header */}
            <View style={{ flexDirection: "row", marginTop: 24 }}>
              <Text style={styles.title}>{plan.title}</Text>
            </View>
            {/* Table */}
            <View style={styles.tableContainer}>
              <TableHeader />
              <Fragment>{rows}</Fragment>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default PDFView