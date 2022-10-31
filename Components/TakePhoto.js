import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native'
import React from 'react'

export default function TakePhoto() {
  return (
    <View style={{ flex: 1, alignItems: 'center',}}>
       <Image source={require('../assets/logo_uso.jpeg')} style={styles.imageSt}/>
      <Text>Búsqueda de Usuarios</Text>
      <TextInput
        style={styles.input}
        // onChangeText={onChangeText}
        // value={'Buscar num de expediente'}
        placeholder="Buscar num de expediente"

      />
        <TouchableOpacity style={styles.touchOpStyl} activeOpacity={'1%'}>
            <Text>
                Buscar
            </Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({

     touchOpStyl: {
        padding: 20, 
        height: 10,
        width: 100,
        borderWidth: 1,
        borderColor: 'red'
     },
     input: {
        height: 40,
        width: '85%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
      imageSt:{
            height:110,
            width: 320,
            marginBottom: '15%',
            marginTop: '25%'
      }
     
})