import { View, Text, Image, StyleSheet,Button, 
           TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, {useState, useEffect} from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; 
import { Camera } from 'expo-camera';

import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';

import * as MediaLibrary from 'expo-media-library';
// import * as Permissions from 'expo-permissions'; // ver estp luego

// import ImgToBase64 from 'react-native-image-base64';
import fetchDatos from './fetchDatos';
// import RNFS from 'react-native-fs';

import { showMessage, hideMessage } from "react-native-flash-message";
import Spinner from 'react-native-loading-spinner-overlay';

import {useNavigation} from '@react-navigation/native'; 

export default function Perfil({route}) {

    const navigation = useNavigation();

    //datos del carnet
    const {IDCarnet, Nombre, Description, Foto, Carnet} = route.params

    const [selectedImage, setSelectedImage] = useState(null);
    const [image, setImage] = useState('')
    const [MisPermisos, setMisPermisos] = useState(false)
    const [cameraPermission, setCameraPermission] = useState(null);
    const [galleryPermission, setGalleryPermission] = useState(null);

    const [camera, setCamera] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [loading, setLoading] = useState(false);
    const [netInfo, setNetInfo] = useState('');
    const [print, setPrint] = useState(true);
    const [printOk, setPrintOk] = useState(false)

    useEffect(() => {
      // Subscribe to network state updates
          // para conocer el estado de la red
      const unsubscribe = NetInfo.addEventListener((state) => {
        setNetInfo(
          state.isConnected
        );
      });

      return () => {
        // Unsubscribe to network state updates
        unsubscribe();
      };
    }, []);

    const fetchSentCarnet = () =>{
      const formData = new FormData();
      formData.append("IDPersona", IDCarnet)
      formData.append("Salida", Carnet.toUpperCase()) // El texto debe ser en mayúsculas, porque así se recibe  del lado del servidor

      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/form-data'
        },
        body: formData
      }

      NetInfo.fetch().then((state) => {
        if (state.isConnected == true) {

          setLoading(true);
          
          fetch( `https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/registrarencolaimpresion.php`, options)
            .then((response) => response.text())
            .then((json) => {
              console.log(json);
              if (JSON.stringify(json) == '"1"') {
                showMessage({
                  message: "NOTIFICACIÓN",
                  type: "success",
                  description: "¡Su petición de impresión ha sido enviada!",
                });
                setPrint(true);
                setPrintOk(true);
              } else {
                showMessage({
                  message: "ERROR",
                  type: "danger",
                  description: "Su petición de impresión no fue enviada",
                });
              }
              setLoading(false);
            })
            .catch((error) => {
              console.error(error);

              setLoading(false);

              showMessage({
                message: "ERROR",
                type: "danger",
                description: "revice su conexión a internet e inténtelo de nuevo",
              });
            });
        } else {
          showMessage({
            message: "ADVERTENCIA",
            type: "warning",
            description: "Parece que no está conectado a la red",
          });
        }
      });

    }

    const printingCarnet = () => {
      if(printOk == true) {
        Alert.alert(  
          'Información',  
          'Ya hay una petición de impresión enviada, ¿desea volver a enviarla? pulse OK.',  
          [  
              {  
                  text: 'Cancelar',  
                 // algo 
                 onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',  
              },  
              {text: 'OK', 
              onPress: ()=> [ fetchSentCarnet()]
            },   
          ]  
        ); 
      }
      else {
        fetchSentCarnet();
      }

    }

    const formData = new FormData();
    formData.append("IDCarnet", IDCarnet)
    formData.append("Foto", image)

    const fetch_updating = async () => { //todo: FETCH DATA

      let mod="";
      let value="";

      if (Carnet == "Estudiante") {
        mod = "actualizarfotoestudiante";
      } else {
        mod = "actualizarfoto";
      }

      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/form-data'
        },
        body: formData
      }

      NetInfo.fetch().then((state) => {
        // alert(
        //   `Connection type: ${state.type}
        //   Is connected?: ${state.isConnected}
        //   IP Address: ${state.details.ipAddress}`
        // );
        
        setLoading(true);

        if (state.isConnected == true) {
          // return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=852f0cc2950393b0017a359bafdec870&language=en-US&page=1&primary_release_year=2022&with_genres=${genre_ids}`)
          fetch( `https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/${mod}.php`, options)
            .then((response) => response.text())
            .then((json) => {
              // return json.movies;
              console.log(json);
              // Alert.alert(JSON.stringify(json))
              if (JSON.stringify(json) == '"1"') {
                // Alert.alert('hola')
                showMessage({
                  message: "NOTIFICACIÓN",
                  type: "success",
                  description: "Su carnet ha sido actualizado",
                });
                setPrint(true);
              } else {
                showMessage({
                  message: "ERROR",
                  type: "danger",
                  description: "Su carnet no ha sido actualizado",
                });
              }
              setLoading(false);
            })
            .catch((error) => {
              console.error(error);

              setLoading(false);

              showMessage({
                message: "ERROR",
                type: "danger",
                description: "Su carnet no ha sido actualizado",
              });
            });
        } else {
          showMessage({
            message: "ADVERTENCIA",
            type: "warning",
            description: "Parece que no está conectado a la red",
          });
        }
      });

    };

    const OpeningCamera = async () => { //? Permisos de cámera
     // navigation.navigate('Open Camera')
      //here is how you can get the camera permission

      const cameraPermission = await Camera.requestCameraPermissionsAsync();
        
      setCameraPermission(cameraPermission.status === 'granted');

      const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
      // console.log(imagePermission.status);

      setGalleryPermission(imagePermission.status === 'granted');

      if (
        imagePermission.status !== 'granted' &&
        cameraPermission.status !== 'granted'
      ) {
        Alert.alert('Permission for media access needed.');
        setMisPermisos(false)
      }
      else
      {
        setMisPermisos(true)
        setSelectedImage(null)
        
      }
      

    }

    const takePicture = async () => {
      if (camera) {
        let data = await camera.takePictureAsync({
          aspect: [3, 4],
          quality: 0.5,
          base64: true
         });
         // console.log(image); // cadena base64 obtenida del state image
         setImage(data.base64) //? asignando la foto tomada, para guardarla
        // console.log(data.uri); // uri de foto obtenida
        setSelectedImage(data.uri); //? asignando la foto tomada, para visualizarla
        setPrint(false); //? ocultando el botón de imprimir
      }
    };

    const OpeningGalery = async () => {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.1,
        base64: true
      });
      // console.log(pickerResult);
      // console.log(pickerResult.base64); // obteniendo la imagen en base64
      // const {uri} = pickerResult;
      // setMyUrl(uri);
      setImage(pickerResult.base64);
      // console.log(MyUrl);
      if (pickerResult.cancelled === true) {
        return;
      }
      // setSelectedImage(null);
      setSelectedImage(pickerResult.uri);
      setPrint(false); // para ocultar el botón de impresión
    };

    async function savePicture(){
      const asset = await MediaLibrary.createAssetAsync(selectedImage)
      .then( ()=>{
        alert('Fotografia guardada')
      })
      .catch( error=> {
        console.log('err', error);
      })
    }

    if (MisPermisos !== false && selectedImage == null) { //todo: Screen Open Camera
      return (
        <View style={styles.container}>
          <View style={styles.cameraContainer}>
            <Camera
              ref={(ref) => setCamera(ref)}
              style={styles.fixedRatio}
              type={type}
              ratio={"1:1"}
            />
          </View>
          <TouchableOpacity
            style={[styles.btnApp, { left: 20 }]}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.front
                  ? Camera.Constants.Type.back
                  : Camera.Constants.Type.front
              );
            }}
          >
            <Ionicons name="camera-reverse" size={50} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnApp, { right: 20 }]}
            onPress={() => {
              takePicture();
            }}
          >
            <Ionicons name="camera" size={50} color="white" />
          </TouchableOpacity>
        </View>
      );
    }

    if (selectedImage !== null) { //todo: Screen Update Photo taked
      return (
        <View style={styles.content}>
          <Spinner
            //visibility of Overlay Loading Spinner
            visible={loading}
            //Text with the Spinner
            textContent={"Cargando..."}
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
          />

          <Text style={styles.Paramstext}>{Nombre}</Text>
          <Text style={styles.Paramstext}>{Description}</Text>

          <Image style={styles.imageProfil} source={{ uri: selectedImage }} />

          {/* <TouchableOpacity style={[styles.btnApp, {right:20} ]} onPress={ ()=> savePicture() }>
              <Ionicons name="checkmark-sharp" size={50} color="green" />
         </TouchableOpacity> */}

          <View style={styles.contentTouch}>
            <TouchableOpacity onPress={OpeningCamera} style={styles.touchFoto}>
              <Text style={styles.buttonText}>TOMAR FOTO</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={OpeningGalery} style={styles.touchFoto}>
              <Text style={styles.buttonText}>ELEGIR DE GALERÍA</Text>
            </TouchableOpacity>
            {print == true?
              <TouchableOpacity onPress={printingCarnet} 
                  style={[styles.touchstate, styles.touchPrint]}>
              <Text style={styles.textUpdStyle}>
                IMPRIMIR
              </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={fetch_updating} 
                style={[styles.touchstate, styles.touchUpdt]}>
              <Text style={styles.textUpdStyle}>
                ACTUALIZAR
              </Text>
            </TouchableOpacity>
            }
          </View>
        </View>
      );
    }

    return ( //todo: Screen Principal
      <View style={styles.content}>
      <Text style={styles.Paramstext}>{Nombre}</Text>
      <Text style={styles.Paramstext}>{Description}</Text>
        <Image style={styles.imageProfil} source={{uri: `data:image/gif;base64,${Foto}`}} />
        <View style={styles.contentTouch}>
          <TouchableOpacity onPress={OpeningCamera} style={styles.touchFoto}>
            <Text style={styles.buttonText}>
              TOMAR FOTO
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={OpeningGalery} style={styles.touchFoto}>
            <Text style={styles.buttonText}>
               ELEGIR DE GALERÍA
            </Text>
          </TouchableOpacity>
          {print == true && Foto!= ""?
            <TouchableOpacity onPress={printingCarnet} 
                  style={[styles.touchstate, styles.touchPrint]}>
              <Text style={styles.textUpdStyle}>
                IMPRIMIR
              </Text>
            </TouchableOpacity>
            :
            null
            }
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  Paramstext: {
    marginTop: 20,
  },
  imageProfil: {
    width: 200,
    height: 200,
    borderRadius: 15,
    borderColor: "lightgray",
    borderWidth: 1,
    resizeMode: "contain",
    marginTop: 15,
  },
  contentTouch: {
    flex: 1,
    marginTop: 30,
    // justifyContent: 'space-around',
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "500",
  },
  touchFoto: {
    marginVertical: 8,
    paddingHorizontal: 75,
    paddingVertical: 15,
    borderWidth: 1,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomColor: "#00bcc9",
    borderColor: "skyblue",
    borderRadius: 15,
  },
  touchstate: {
    marginVertical: 15,
    paddingHorizontal: 75,
    paddingVertical: 15,
    paddingBottom: 10,
    borderRadius: 5,
    borderBottomWidth: 1,
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    // shadowColor: 'darkgray',
    shadowOffset: { width: 4, height: 4 },
    elevation: 1.5,
    marginBottom: 10,
  },
  touchPrint:{
    backgroundColor: "tomato",
    borderBottomColor: "tomato",
  },
  touchUpdt:{
    backgroundColor: "#00bcd4",
    borderBottomColor: "#00bcc9",
  },
  textUpdStyle:{
    color: "white", 
    justifyContent: "center", 
    textAlign: "center",
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  button: {
    flex: 0.1,
    padding: 10,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  btnApp: {
    position: "absolute",
    backgroundColor: "skyblue",
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    bottom: 20,

    paddingVertical: 5,
  },
});