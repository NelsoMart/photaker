import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, FlatList, StatusBar, RefreshControl,
            SafeAreaView,TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { showMessage } from "react-native-flash-message";
import { Ionicons, Feather  } from "@expo/vector-icons";

import AsyncStorage from '@react-native-async-storage/async-storage';

  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{item.IDEmpleado}</Text>
    </TouchableOpacity>
  );


export default function Settings() {

  // const [data, setData] = useState([{id: 1, title: 'UTI'}, {id: 2, title: 'SECRETARÍA'}, {id: 3, title: 'BIBLIOTECA'},]);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(true)
  const [badConnection, setbadConnection] = useState(false)
  // const [dataResult, setDataResult] = useState('')
  const [selectedId, setSelectedId] = useState(null); // colocar 1 para dejar listo 


  useEffect(() => {
      getData();
      fetchData();
  },[]) 

  const onRefresh = () => {
    //Clear old data of the list
    setData([])
    setRefreshing(true)
    //Call the Service to get the latest data
    fetchData()
  }
  

  //   Storing object value
const storeData = async (value) => {

  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@storage_Key', jsonValue)
  } catch (e) {
    // saving error
    console.log(e)
  }
}

  // Reading object value
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key')
      return jsonValue != null ? setSelectedId(JSON.parse(jsonValue)) : null;
      
    } catch(e) {
      // error reading value
      console.log(e)
    }
  }
  
  const goSavingEffect = (value) => {
    setSelectedId(value)
    storeData(value)
  }

  const fetchData = () => { //todo: fetchData 
      NetInfo.fetch().then((state) => {
          //* verificando estado de red
          if (state.isConnected == true) {
          setRefreshing(true);
          setbadConnection(false)

          fetch( `https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/wsempleados.php?Nombre=Mar`)
              .then((response) => response.json())
              .then((json) => {
              if (JSON.stringify(json) == "0") 
              {
                  setData([]);
              } 
              else 
              {
                  setData(json);
              }
              setRefreshing(false);
              })
              .catch((error) => {
              setRefreshing(false);
              console.error(error);
              showMessage({
                  message: "ERROR",
                  type: "danger",
                  description:
                  "Revise su conexión a internet e inténtelo de nuevo",
              });
              });
          } else {
            setRefreshing(false)
            setbadConnection(true)
            showMessage({
                message: "ERROR",
                type: "danger",
                description: "Parece que no tiene conexión a internet",
            });
          }
      });
  };

    const renderItem = ({ item }) => {

        const backgroundColor = item.IDEmpleado === selectedId ? "#0084CA" : "#74D1EA"; // para el fondo
        const color = item.IDEmpleado === selectedId ? 'white' : 'black'; // para el texto
    
        return (
          <Item
            item={item}
            // onPress={() => setSelectedId(item.id)}
            onPress={() => goSavingEffect(item.IDEmpleado)}
            backgroundColor={{ backgroundColor }}
            textColor={{ color }}
          />
        );
      };

    const keyExtractor = useCallback((item)=>item.IDEmpleado.toString(), []);
    const ITEM_HEIGHT = 200;
    const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [] )
    
      return (
        <SafeAreaView style={styles.container}>
        <View style = {styles.ViewDText}>
          <Text style={styles.text}>Elija una zona de trabajo</Text>
        </View>
         {badConnection ==false? 
            <FlatList
              enableEmptySections={true}
              data={data}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              extraData={selectedId}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh.bind(this)}
                />}
            />
           :
           <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center',}}>
            <Text style={styles.textNetwork}>En este momento no tiene conexión a internet.</Text>
              <Feather name="wifi-off" size={45} color="gray" />
           </View>
           
          }
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    ViewDText:{
      //  flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       marginTop: 15,
       marginBottom: 15,
    },
    text: {
        fontSize: 20,

    },
    textNetwork:{
      fontSize: 20,
      color: 'gray',
      paddingBottom: 16,
      textAlign: 'center',
      marginHorizontal: 15,
    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  });
