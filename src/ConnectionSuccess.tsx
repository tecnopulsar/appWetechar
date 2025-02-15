import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ConnectionSuccess = ({ route }: { route: any }) => {
  const { ssid } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="wifi" size={48} color="#4CAF50" />
        <Text style={styles.title}>Conectado a:</Text>
        <Text style={styles.ssid}>{ssid}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  ssid: {
    fontSize: 18,
    color: '#6200EE',
    marginTop: 5,
  },
});

export default ConnectionSuccess;