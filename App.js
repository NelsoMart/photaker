import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FlashMessage from "react-native-flash-message";


import Home from './Components/Home';
import Busqueda from './Components/Busqueda';
import TakePhoto from './Components/TakePhoto';
import Perfil from './Components/Perfil';
import OpenCamera from './Components/OpenCamera';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inicio" component={Home} options={{/*headerTitle: null,*/ headerTitleAlign: "center", /*headerShown: false*/ }}/>
        <Stack.Screen name="Búsqueda" component={Busqueda} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Open Camera" component={OpenCamera} />
      </Stack.Navigator>
      <FlashMessage position="bottom" />
    </NavigationContainer>
  );
}

export default App;