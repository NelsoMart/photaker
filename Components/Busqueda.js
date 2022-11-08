
//import liraries
import React, { useEffect, useState, useCallback, useRef} from 'react';

import { View, Text, StyleSheet, TouchableOpacity,TextInput, 
          Alert, RefreshControl, FlatList, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { Keyboard } from 'react-native'; 
import LottieView from 'lottie-react-native';
import NotFoundAnimation from '../LottieFiles/94729-not-found.json';
import NetInfo from '@react-native-community/netinfo';

import { showMessage } from "react-native-flash-message";

Keyboard.dismiss()

import fetchDatos from '../Components/fetchDatos';
import DispachMessage from '../src/useFlashMessage';
import useFetch from '../src/useFetch';


// create a function
export default function Busqueda({route}) {

//* -------------- Deconstrucción de mis hooks ---------------
        const {
          messageError,
          messageWarning,
          messageSuccess
        } = DispachMessage();

        const {
            MyCustomFetch,
        } = useFetch();
//* -----------------------------------------------------------

  const {Carnet} = route.params

     const [data, setData] = useState([]);
     const [text, onChangeText] = useState("Buscar Expediente");
     const [refreshing, setRefreshing] = useState(false)
     const [dataResult, setDataResult] = useState('')
     const [MyInputType, SetInputTtype] = useState("numeric");
     const [loading, setLoading] = useState(false);



    //  const flatListRef = useRef(null)

     const inputRef = useRef(null);
     const animation = useRef(null);


    const onFocusHandler = () => {
    inputRef.current && inputRef.current.focus();
    }

    setTimeout(() => inputRef.current && inputRef.current.focus(), 100)

    const navigation = useNavigation();

    useEffect(() => {
      // Subscribe to network state updates
      const unsubscribe = NetInfo.addEventListener((state) => {
        // setNetInfo(state.isConnected);
      });

      onFocusHandler();

      if (Carnet == "Estudiante") {
        SetInputTtype("number-pad");
      } else {
        SetInputTtype("default");
      }
      return () => {
        // Unsubscribe to network state updates
        unsubscribe();
      };
    }, [MyInputType, Carnet, text, refreshing, loading, onFocusHandler, inputRef]);

    useEffect(() => {
         onFocusHandler();
         const willFocusSubscription = navigation.addListener('focus', () => {
          onFocusHandler();
        });

        return () => {
          // Unsubscribe to network state updates
          willFocusSubscription;
        };
    }, [onFocusHandler, inputRef]);


    // const wait = (timeout) => {
    //   return new Promise(resolve => setTimeout(resolve, timeout));
    // }

    const onRefresh = () => {
      //Clear old data of the list
      setData([])
      // setRefreshing(true)
      //Call the Service to get the latest data
      fetchData()
    }



    const FetchPlace = "LikeGet";

    const fetchData = () => {
      // 26396 topnumexp

      // setRefreshing(true);
      setLoading(true);

      const callbackOk = (json) => {
        if (JSON.stringify(json) == "0") {
          setDataResult("Ok");
          setData([]);
        } else {
          setData(json);
          setDataResult("");
        }
        setRefreshing(false);
        setLoading(false);

        //?Deconstrucción if empleado
        // const {IDEmpleado, Empleado, Cargo, Unidad, Foto} = json[0];
        // setIdEmpleado(IDEmpleado);
        // SetEmpleado(Empleado);
      }
        
      const callBackError = (error) => {
        setRefreshing(false);
        setLoading(false);
        console.error(error);
        messageError("revice su conexión a internet e inténtelo de nuevo");
      }

      const callBackStateLoaddingTrue = () => {
        // setRefreshing(true)
        setLoading(true)
        
      }
      const callBackStateLoadingFalse = () => {
        // setRefreshing(false)
        setLoading(false)
      }

      Keyboard.dismiss();

      let mod = "";
      let value = "";

      if (Carnet == "Estudiante") {
        mod = "wsestudiantes";
        value = "IDExpediente";
      } else {
        mod = "wsempleados";
        value = "Nombre";
      }

      let url =  `https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/${mod}.php?${value}=${text}`;

      if (text == "Buscar Expediente" || text == "") {
        Alert.alert("", "Escriba algo");
        setLoading(false)
      } else {

        // setRefreshing(true);

        // NetInfo.fetch().then((state) => {
        //   //* verificando estado de red
        //   if (state.isConnected == true) {

        //     // setRefreshing(true);

        //     // fetch(`https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/wsestudiantes.php?IDExpediente=${text}`)
        //     // fetch(`https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/wsempleados.php?Nombre=${text}`)
        //     fetch(`https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/${mod}.php?${value}=${text}`)
        //       .then((response) => response.json())
        //       .then((json) => {
        //         if (JSON.stringify(json) == "0") {
        //           setDataResult("Ok");
        //           setData([]);
        //         } else {
        //           setData(json);
        //           setDataResult("");
        //         }
        //         setRefreshing(false);

        //         //?Deconstrucción if empleado
        //         // const {IDEmpleado, Empleado, Cargo, Unidad, Foto} = json[0];
        //         // setIdEmpleado(IDEmpleado);
        //         // SetEmpleado(Empleado);
        //       })
        //       .catch((error) => {
        //         setRefreshing(false);
        //         console.error(error);
        //         messageError("Revise su conexión a internet e inténtelo de nuevo");
        //       });
        //   } else {
        //     messageWarning("Parece que no tiene conexión a internet");
        //     setRefreshing(false)
        //   }
        // });
          
        MyCustomFetch({
          callbackOk, 
          callBackError,
          callBackStateLoaddingTrue,
          callBackStateLoadingFalse,
          url,
          FetchPlace,
        });


      }
    };

    let GoingToProfil = (item) => {

      //* Reseteando, para que al volver atrás, se tenga que buscar de nuevo, y así refresque la foto
      setData([]); 

      Carnet == "Estudiante"?
        navigation.navigate('Perfil', {
          IDCarnet: item.IDExpediente,
          Nombre: item.Estudiante,
          Description: item.Carrera,
          Foto: item.Foto,
          //extra
          Carnet: Carnet,
        })
        :
        navigation.navigate('Perfil', {
          IDCarnet: item.IDEmpleado,
          Nombre: item.Empleado,
          Description: item.Cargo,
          Foto: item.Foto,
           //extra
           Carnet: Carnet,
        })

    }

    const renderItem = ({item}) => {
        return(
          <TouchableOpacity onPress={() => [GoingToProfil(item), ]} 
          // style={styles.TouchDProfil}
          >
          { Carnet == "Estudiante" ?
            <View style={styles.viewInTouch}>
             <Text>{item.IDExpediente}</Text>
            <Text>{item.Estudiante}</Text>
            <Text>{item.Carrera}</Text>
          </View>
          :
          <View style={styles.viewInTouch}>
             <Text>{item.IDEmpleado}</Text>
            <Text>{item.Empleado}</Text>
            <Text>{item.Cargo}</Text>
          </View>
          }
           
          </TouchableOpacity>
        );
    }

    const keyExtractor = useCallback((item)=>Carnet=="Estudiante"?item.IDExpediente.toString():item.IDEmpleado.toString(), []);
    const ITEM_HEIGHT = 200;
    const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [] )

    const ListViewItemSeparator = () => {
      return(
        <View style={{borderColor:'lightgray', borderWidth:0.5, marginVertical: '1%' }}/>
      )
    }

    return (
      <View style={styles.content}>
        {/* <Image source={require('../assets/logo_uso.jpeg')} style={styles.imageSt}/> */}
        <View style={{flexDirection: 'row',}}>
        <Text>Búsqueda de Usuario:</Text>
        <Text style={{color:Carnet=="Estudiante"?'#2EA1F0':'tomato'}}> { Carnet }</Text>
        </View>
        <TextInput 
          keyboardType={MyInputType}
          style={styles.input}
          onChangeText={onChangeText}
          ref={inputRef}
          // value={text}
          placeholder={
            Carnet == "Estudiante"
              ? "Introducir num. de expediente"
              : "Escriba el Nombre"
          }
        />
        <TouchableOpacity
          style={styles.touchOpStyl}
          activeOpacity={0.1}

          onPress={fetchData}
        >
          <Text style={styles.textTouch}>Buscar</Text>
        </TouchableOpacity>

        
        
         { loading?
          <View>
             <ActivityIndicator/>
             {/* <Text>Loading {JSON.stringify(loading)}</Text>
             <Text>Refreshin {JSON.stringify(refreshing)}</Text> */}
          </View>
          : null}
        

        {data == "" && dataResult == "Ok" ? (
          <View style={styles.content}>
          <LottieView
                autoPlay
                ref={animation}
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: "#F0F3F4",
                  borderRadius: 30,
                }}
                source={NotFoundAnimation}
              />
            <Text style={{ fontSize: 16, color: "gray" }}>
              No se encontró ningún resultado.
            </Text>
            
          </View>
        ) : null}

        <View style={styles.dataProfil}>
          <FlatList
            enableEmptySections={true}
            ItemSeparatorComponent={ListViewItemSeparator}
            data={data}
            // renderItem={({ item }) => renderItem(item, navigation)}
            renderItem={renderItem}
            // keyExtractor={(item, index) => index.toString()}
            keyExtractor={keyExtractor}
            //* Performance settings
            getItemLayout={getItemLayout}
            windowSize={100} // Reduce the window size 300 ideal pero lenta // muy importante, pero si la reduzco más, hace un molesto parpadeo de la lista
            removeClippedSubviews={true} // Unmount components when outside of window
            initialNumToRender={5} // Reduce initial render amount
            maxToRenderPerBatch={15} // Reduce number in each render batch
            legacyImplementation={true}
            onEndReachedThreshold={50}
            //* refresh control used for the Pull to Refresh
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh.bind(this)}
                // onRefresh={() => onRefresh()}
              />
            }
          />
        </View>
      </View>
    );
  }

// define styles

const styles = StyleSheet.create({

    content:{
       flex:1,
      //  justifyContent: 'center',
       alignItems: 'center', 
       marginTop: '10%',
      //  backgroundColor: '#ffffff'

    }, 
    imageSt:{
      height:135,
      width: '95%',
      marginBottom: '15%',
      marginTop: '0%'
    },
    touchOpStyl: {
      marginTop: '1%',
      marginBottom: '10%',
       paddingVertical: 5,
       paddingHorizontal: '15%',
       borderWidth: 1,
       borderBottomWidth: 4,
      borderLeftWidth: 4,
       borderColor: 'skyblue',
       borderRadius: 15,
       color: 'red',
    },
    textTouch:{
        color: 'black',
        fontSize: 16,
        fontWeight: '500'
      
    },
    input: {
       height: 45,
       width: '85%',
       margin: 12,
       borderWidth: 1,
       borderRadius: 10,
       borderColor: 'darkgray',
       padding: 10,
     },
     dataProfil:{
      flex: 1,
        // borderColor: "gray",
        // borderWidth: 0.4,
        // borderRadius: 7,
        // padding: 3,
        // flexDirection: "row",
        // marginTop: 5,
        // marginLeft: 5,
        // marginRight: 5,
        // paddingBottom: 3,
        // backgroundColor: "#323436",
       },
     TouchDProfil:{
      borderWidth: 1,
      borderColor: 'lightgray',
      borderRadius: 5,
      // paddingHorizontal: '30%',
      // paddingVertical: '7%',
      marginHorizontal: '20%',
      // marginVertical: '14%',
      
     },
     viewInTouch:{
      marginLeft: 15,
      marginVertical: 10
     }
    
})
