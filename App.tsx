import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './src/HomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import ConnectionSuccess from './src/ConnectionSuccess';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Wifi Scanner - Wetechar"
          options={{
            title: 'Wifi Scanner - Wetechar',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#6200EE', // Color de fondo del header
            },
            headerTintColor: '#fff', // Color del texto del título
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
          }}
          component={HomeScreen}
        />
        <Stack.Screen name="ConnectionSuccess" component={ConnectionSuccess} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
