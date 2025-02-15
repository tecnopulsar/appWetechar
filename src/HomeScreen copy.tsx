import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Prompt from 'react-native-prompt-android';

// Definir un tipo para las redes Wi-Fi
type WifiNetwork = {
  SSID: string;
  BSSID: string;
  level: number;
  capabilities?: string; // Información sobre si la red está protegida
};

// Paleta de colores
const colors = {
  primary: '#6200EE', // Morado moderno
  secondary: '#03DAC6', // Turquesa
  background: '#FFFFFF', // Blanco
  text: '#000000', // Negro
  error: '#B00020', // Rojo
  success: '#4CAF50', // Verde
};

// Función para formatear la dirección MAC
const formatBSSID = (bssid: string) => {
  return bssid
    .toUpperCase() // Convertir a mayúsculas
    .match(/.{1,2}/g) // Dividir en pares de caracteres
    ?.join(':') || bssid; // Unir con ":" o devolver el original si no se puede formatear
};

// Componente para cada ítem de red Wi-Fi
const WifiItem = ({ ssid, bssid, level, capabilities, onConnect }: { ssid: string; bssid: string; level: number; capabilities?: string; onConnect: () => void }) => (
  <View style={styles.item}>
    <Ionicons name="wifi" size={24} color={colors.primary} style={styles.icon} />
    <View style={styles.itemTextContainer}>
      <Text style={styles.title}>{ssid}</Text>
      <Text style={styles.details}>MAC: {formatBSSID(bssid)}</Text>
      <Text style={styles.details}>Intensidad: {level} dBm</Text>
      {capabilities && <Text style={styles.details}>Protegida: {capabilities.includes('WPA') ? 'Sí' : 'No'}</Text>}
    </View>
    <TouchableOpacity style={styles.connectButton} onPress={onConnect}>
      <Ionicons name="wifi" size={24} color={colors.background} />
    </TouchableOpacity>
  </View>
);

// Componente principal
const HomeScreen = () => {
  const [wifiList, setWifiList] = useState<WifiNetwork[]>([]);
  const [filterEnabled, setFilterEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Solicitar permisos y escanear redes al cargar el componente
  useEffect(() => {
    requestPermissions();
  }, []);

  // Solicitar permisos de ubicación
  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de ubicación requerido',
          message: 'Esta aplicación necesita acceso a tu ubicación para escanear redes Wi-Fi.',
          buttonNeutral: 'Preguntar después',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permiso de ubicación concedido');
        scanWifiNetworks();
      } else {
        setError('Permiso de ubicación denegado');
        Alert.alert('Permiso denegado', 'No se puede escanear redes Wi-Fi sin permisos de ubicación.');
      }
    } catch (err) {
      console.warn('Error al solicitar permisos:', err);
      setError('Error al solicitar permisos');
    }
  };

  // Escanear redes Wi-Fi
  const scanWifiNetworks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const wifiNetworks = await WifiManager.loadWifiList();
      console.log('Redes Wi-Fi encontradas:', wifiNetworks);

      if (Array.isArray(wifiNetworks) && wifiNetworks.length > 0) {
        let filteredNetworks = wifiNetworks;

        // Aplicar filtro si está activado
        if (filterEnabled) {
          filteredNetworks = wifiNetworks.filter((network) =>
            network.SSID && network.SSID.includes('RaspberryAP')
          );
          console.log('Redes filtradas (RaspberryAP):', filteredNetworks);
        }

        setWifiList(filteredNetworks);
      } else {
        setError('No se encontraron redes Wi-Fi.');
      }
    } catch (error) {
      console.log('Error escaneando redes Wi-Fi:', error);
      setError('Error escaneando redes Wi-Fi. Revisa los permisos y la configuración.');
    } finally {
      setIsLoading(false);
    }
  };

  // Conectar a una red Wi-Fi
  const connectToWifi = async (ssid: string, isProtected: boolean = false) => {
    console.log(`Intentando conectar a la red: ${ssid}`);
    console.log(`¿Está protegida? ${isProtected}`);

    try {
      if (isProtected) {
        // Si la red está protegida, pedir la contraseña al usuario
        Prompt(
          'Contraseña requerida',
          `Ingresa la contraseña para la red: ${ssid}`,
          [
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: () => {
                console.log('Conexión cancelada por el usuario');
              },
            },
            {
              text: 'Conectar',
              onPress: (password) => {
                if (password) {
                  console.log(`Contraseña ingresada: ${password}`);
                  // Conectar a una red protegida (4 argumentos: SSID, password, isWEP, isHidden)
                  WifiManager.connectToProtectedSSID(ssid, password, false, false)
                    .then(() => {
                      console.log(`Conexión exitosa a la red: ${ssid}`);
                      Alert.alert('Conexión exitosa', `Conectado a la red: ${ssid}`);
                    })
                    .catch((error) => {
                      console.log('Error conectando a la red Wi-Fi:', error);
                      Alert.alert('Error', 'No se pudo conectar a la red Wi-Fi. Verifica la contraseña.');
                    });
                } else {
                  console.log('No se ingresó contraseña');
                }
              },
            },
          ],
          {
            type: 'secure-text', // Campo de texto seguro para la contraseña
            cancelable: false, // Evitar que el usuario cierre el prompt sin ingresar datos
          }
        );
      } else {
        // Si la red no está protegida, conectar directamente
        console.log(`Conectando a red abierta: ${ssid}`);
        await WifiManager.connectToSSID(ssid);
        console.log(`Conexión exitosa a la red: ${ssid}`);
        Alert.alert('Conexión exitosa', `Conectado a la red: ${ssid}`);
      }
    } catch (error) {
      console.log('Error conectando a la red Wi-Fi:', error);
      Alert.alert('Error', 'No se pudo conectar a la red Wi-Fi.');
    }
  };

  // Renderizar contenido principal
  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={colors.primary} />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (wifiList.length === 0) {
      return <Text style={styles.emptyText}>No se encontraron redes Wi-Fi.</Text>;
    }

    return (
      <FlatList
        data={wifiList}
        renderItem={({ item }) => (
          <WifiItem
            ssid={item.SSID}
            bssid={item.BSSID}
            level={item.level}
            capabilities={item.capabilities}
            onConnect={() => connectToWifi(item.SSID, item.capabilities?.includes('WPA'))}
          />
        )}
        keyExtractor={(item) => item.BSSID || Math.random().toString()}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Redes Wi-Fi disponibles</Text>

      <View style={styles.filterContainer}>
        <Ionicons name="filter" size={20} color={colors.primary} style={styles.filterIcon} />
        <Text style={styles.filterLabel}>Filtrar por "RaspberryAP":</Text>
        <Switch
          value={filterEnabled}
          onValueChange={(value) => {
            setFilterEnabled(value);
            scanWifiNetworks();
          }}
          thumbColor={colors.primary}
          trackColor={{ false: '#ccc', true: colors.secondary }}
        />
      </View>

      <TouchableOpacity style={styles.refreshButton} onPress={scanWifiNetworks}>
        <Ionicons name="refresh" size={20} color={colors.background} style={styles.refreshIcon} />
        <Text style={styles.refreshText}>Actualizar</Text>
      </TouchableOpacity>

      {renderContent()}
    </View>
  );
};

// Estilos (igual que antes)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.primary,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: colors.text,
  },
  details: {
    fontSize: 14,
    color: 'gray',
  },
  connectButton: {
    backgroundColor: colors.success,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  refreshIcon: {
    marginRight: 5,
  },
  refreshText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterIcon: {
    marginRight: 10,
  },
  filterLabel: {
    fontSize: 16,
    color: colors.text,
    marginRight: 10,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default HomeScreen;