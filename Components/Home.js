import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import {useNavigation, useScrollToTop} from '@react-navigation/native';


export default function Home() {

  const CarnetEMP = "Empleado";
  const CarnetEST = "Estudiante";

  const navigation = useNavigation();

  let GoingToSearchEMP = () =>{
    navigation.navigate('Búsqueda', {
      Carnet: CarnetEMP,
    })
  }

  let GoingToSearchEST = () =>{
    navigation.navigate('Búsqueda', {
      Carnet: CarnetEST
    })
  }

  return (
    <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.principal}>
        <Image
          source={require("../assets/phototaker_logo.jpeg")}
          style={styles.imageSt}
        />
        <View style={styles.viewTouch}>
          <TouchableOpacity
            style={styles.touchStyle}
            onPress={GoingToSearchEMP}
          >
            <Text style={[styles.textTouch, { paddingHorizontal: "15%" }]}>
              CARNET DE EMPLEADO
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewTouch}>
          <TouchableOpacity
            style={styles.touchStyle}
            onPress={GoingToSearchEST}
          >
            <Text style={[styles.textTouch, { paddingHorizontal: "13%" }]}>
              CARNET DE ESTUDIANTE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  principal: {
    // flexDirection: "row",
    flex: 1,
    // justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 15,
    
  },
  imageSt:{
    height:100,
    width: '50%',
    marginBottom: '15%',
    resizeMode: 'contain',
    marginTop: '1%',
    marginBottom: '15%'
    // borderWidth: 1,
  },
  touchStyle:{
    paddingVertical: 40,
    borderWidth: 1.3,
    borderBottomWidth: 6,
    borderLeftWidth: 5,
    borderRadius: 20,
    borderColor: 'skyblue',
  },
  viewTouch: {
      marginVertical: 10,
      // paddingHorizontal: 30,
      // borderColor: 'red',
      // borderWidth: 1,
  },
  textTouch:{
     color: 'black',
     fontWeight: '500',
     
  }
});
