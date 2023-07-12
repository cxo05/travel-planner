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
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
  },
  date: {
    width: '20%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  time: {
    width: '20%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  event: {
    width: '60%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  }
});

const TableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.date}>Date</Text>
    <Text style={styles.time}>Time</Text>
    <Text style={styles.event}>Event</Text>
  </View>
);

export default TableHeader