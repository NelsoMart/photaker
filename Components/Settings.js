import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, FlatList, StatusBar, RefreshControl,
            SafeAreaView,TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { showMessage } from "react-native-flash-message";
import { Ionicons, Feather  } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

import DispachMessage from '../src/useFlashMessage';
import useFetch from '../src/useFetch';


const Item = ({ item, onPress, borderColor, textColor }) => (
  <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.item, borderColor]}>
    <Text style={[styles.title, textColor]}>{item.zona}</Text>
  </TouchableOpacity>
);
  

export default function Settings() {

  // const [DATA, setDATA] = useState([{workzoneId: 1, Empleado: 'UTI'}, {workzoneId: 2, Empleado: 'SECRETARÍA'}, {workzoneId: 3, Empleado: 'BIBLIOTECA'},]);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(true)
  const [badConnection, setbadConnection] = useState(false) // Para decidir colocar el icono indicativo de mala conexión
  // const [dataResult, setDataResult] = useState('')
  const [selectedId, setSelectedId] = useState(null); // colocar 1 para dejar listo 

  //* -------------- Deconstrucción de mis hooks ---------------
    const {
          messageError,
    }=DispachMessage();
    const {
          MyCustomFetch,
    }=useFetch();
 //* -----------------------------------------------------------

  useEffect(() => {
      getData(); // obteniendo los datos de asyncstorage
      fetchData(); // obteniendo los datos de fetch
  },[]) 

  const onRefresh = () => { // refrescando FlatList
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

  // Reading object asyncstorage value
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
    showMessage({
      message: "Información",
      type: "success",
      description: "¡Zona de trabajo guardada!",
      position: "bottom",
    });
  }

  const callbackOk = (json) => {
    if (JSON.stringify(json) == "0") {
      setData([]);
    } else {
      setData(json);
      // console.log(data);
    }
    setRefreshing(false);
  };
    
  const callBackError = (error) => {
      setRefreshing(false);
      console.error(error);      
      messageError("revice su conexión a internet e inténtelo de nuevo");
  }

  const callBackStateLoaddingTrue = () => {
    // setRefreshing(true)
    setRefreshing(true)
    setbadConnection(false)
    
  }
  const callBackStateLoadingFalse = () => {
    // setRefreshing(false)
    setRefreshing(false)
    setbadConnection(true)
  }

  const FetchPlace = "LikeGet";

  const fetchData = () => { //todo: fetchData 

      let url =  `https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/wsworkzone.php`;

      MyCustomFetch({
        callbackOk, 
        callBackError,
        callBackStateLoaddingTrue,
        callBackStateLoadingFalse,
        url,
        FetchPlace,
      });
  };

  const renderItem = ({ item }) => {

      const borderColor = item.workzoneId === selectedId ? "skyblue" : "lightgray"; // para el fondo
      const color = item.workzoneId === selectedId ? '#49B0E3' : '#1F1F1F'; // para el texto
  
      return (
        <Item
          item={item}
          // onPress={() => setSelectedId(item.id)}
          onPress={() => goSavingEffect(item.workzoneId)}
          borderColor={{ borderColor }}
          textColor={{ color }}
        />
      );
  };

    const keyExtractor = useCallback((item)=>item.workzoneId.toString(), []);
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
        marginBottom: 20,
      },
      text: {
          fontSize: 20,
          fontWeight: 'bold',

      },
      textNetwork:{
        fontSize: 20,
        color: 'gray',
        paddingBottom: 16,
        textAlign: 'center',
        marginHorizontal: 15,
      },
      item: {
        // padding: 20,
        // marginVertical: 8,
        // marginHorizontal: 16,
        paddingVertical: 25,
        borderWidth: 1.3,
        borderBottomWidth: 6,
        borderLeftWidth: 5,
        borderRadius: 20,
        // borderColor: 'lightgray',
        marginHorizontal: 20,
        marginVertical: 8,
      },
      title: {
        fontSize: 18,
        textAlign: 'center',
      },
    });
