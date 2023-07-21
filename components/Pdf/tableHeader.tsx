import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#90e5fc'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: '#bff0fd',
    backgroundColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
    flexGrow: 1,
  },
  cell: {
    flexDirection: 'row',
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  date: {
    width: '20%'
  },
  time: {
    width: '20%'
  },
  event: {
    width: '60%',
  }
});

const TableHeader = () => (
  <View style={styles.container} >
    <View style={[styles.cell, styles.date]}>
      <Text>Date</Text>
    </View>
    <View style={[styles.cell, styles.time]}>
      <Text>Time</Text>
    </View>
    <View style={[styles.cell, styles.event]}>
      <Text>Event</Text>
    </View>
  </View>
);

export default TableHeader