// src/styles/globalStyles.js
import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  // Estilos para el header de navegación
  headerTitle: {
    fontFamily: 'Poppins-Bold', // Usar Poppins Bold para el título
    fontSize: 22,
    color: '#fff',
  },
  headerStyle: {
    backgroundColor: '#4F46E5', // Azul moderno
  },

  // Estilos para textos
  title: {
    fontFamily: 'Poppins-Bold', // Usar Poppins Bold
    fontSize: 20,
    color: '#4F46E5',
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular', // Usar Poppins Regular
    fontSize: 14,
    color: '#6B7280',
  },
  message: {
    fontFamily: 'Poppins-Regular', // Usar Poppins Regular
    fontSize: 16,
    color: '#6B7280',
  },
});
