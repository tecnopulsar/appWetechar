import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import ConnectionSuccess from './src/screens/ConnectionSuccess';
import {globalStyles} from './src/styles/globalStyles'; // Importar estilos globales

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: globalStyles.headerStyle, // Estilo del header
          headerTintColor: '#fff', // Color del texto del header
          headerTitleStyle: globalStyles.headerTitle, // Estilo del título
          headerTitleAlign: 'center', // Centrar el título
        }}>
        <Stack.Screen name="Wifi Scanner - Wetechar" component={HomeScreen} />
        <Stack.Screen
          name="ConnectionSuccess"
          component={ConnectionSuccess}
          options={{title: 'Conexión Exitosa'}} // Título personalizado
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
