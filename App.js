import React from 'react';
import { View, Text, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FlashMessage from "react-native-flash-message";


import Home from './Components/Home';
import Busqueda from './Components/Busqueda';
import Perfil from './Components/Perfil';
import Settings from './Components/Settings';
import IconSetting from './Components/IconSetings';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Inicio"
          component={Home}
          options={({ navigation }) => ({
            headerTitleAlign: "center",
            headerRight: () => <IconSetting navigation={navigation} />,
          })}
        />
        <Stack.Screen 
          name="Búsqueda" 
          component={Busqueda} 
          options={({navigation}) => ({
              headerTitleAlign: "center",
              headerRight: () => <IconSetting navigation={navigation} />
            })} 
        />
        <Stack.Screen 
          name="Perfil"
          component={Perfil}
         
          options={({navigation}) => ({
            headerTitleStyle:{
              color: '#2F4B51'
            },
            headerTitleAlign: "center",
              headerRight: () => <IconSetting navigation={navigation} />
            })} 
        />
        <Stack.Screen name="Configuración" component={Settings} />
        <Stack.Screen name="IconSetting" component={IconSetting} />
      </Stack.Navigator>
      <FlashMessage />
    </NavigationContainer>
  );
}

export default App;