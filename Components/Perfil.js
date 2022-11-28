import { View, Text, Image, StyleSheet,
           TouchableOpacity, ScrollView, Alert } from 'react-native';

import React, {useState, useEffect, useContext} from 'react';

import { Ionicons } from '@expo/vector-icons';

import DispachMessage from '../hooks/useFlashMessage';
import useFetch from '../hooks/useFetch';

// import * as Network from 'expo-network';

// import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

//media
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
//save in galery
import * as MediaLibrary from 'expo-media-library';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

import MyCamera from '../screens/Camera';

import Spinner from 'react-native-loading-spinner-overlay';

import {useNavigation} from '@react-navigation/native';
import contextbase from '../contexts/ContextBase';

  export default function Perfil({route}) {

    //? --------------  my hooks deconstruction ---------------
    const {
          messageError,
          // messageWarning,
          messageSuccess
    } = DispachMessage();

    const {
      MyCustomFetch,
      MyCustomFetch2
    } = useFetch();

    const { camera } = useContext(contextbase);
    //? -----------------------------------------------------------

      const navigation = useNavigation();

      //datos del carnet
      const {IDCarnet, Nombre, Description, Foto, Carnet} = route.params

      const [selectedImage, setSelectedImage] = useState(null);
      const [image, setImage] = useState('')
      const [MisPermisos, setMisPermisos] = useState(false)
      const [cameraPermission, setCameraPermission] = useState(null);
      const [galleryPermission, setGalleryPermission] = useState(null);

      // const [camera, setCamera] = useState(null);
      const [type, setType] = useState(Camera.Constants.Type.back);
      const [loading, setLoading] = useState(false);
      // const [netInfo, setNetInfo] = useState('');
      const [print, setPrint] = useState(true);
      const [printOk, setPrintOk] = useState(false)
      const [selectedId, setSelectedId] = useState(null); // obtendrá el estado de la zona de impresión elegida

      const FetchPlace = "LikeGET";  


      useEffect(() => {
        // focus to auto calling function
        const willFocusSubscription = navigation.addListener('focus', () => {
          getData();
        });

        //* Subscribe to network state updates
        // const unsubscribe = NetInfo.addEventListener((state) => {
        //   setNetInfo(
        //     state.isConnected
        //   );
        // });

        navigation.setOptions({ //* no debe estar fuera de useEffect
          //* nombre del status bar
          title: `Perfil de ${Carnet}`,
        });

        getData();
        // clearData();

        return () => {
          //* Unsubscribe to network state updates
          // unsubscribe();
          willFocusSubscription;
        };

      }, [Carnet, printOk]);

      async function clearData(){ //* clean AsyncStorage value
        await AsyncStorage.clear();
        getData();
      }

      //? Reading object value from asynstorage
      const getData = async () => { // determinando zona de trabajo
        try {
          const jsonValue = await AsyncStorage.getItem('@storage_Key')
          return jsonValue != null ? setSelectedId(JSON.parse(jsonValue)) : null;

        } catch(e) {
          // error reading value
          console.log(e)
        }
      }

      const callBackStateLoaddingTrue = () => {
        setLoading(true)
      }

      const callBackStateLoadingFalse = () => {
        setLoading(false)
      }

      const fetchConsultColaImpresion = () => {//todo: FETCH consulta de impresión

        const callbackOk = (json) => {
          // console.log('Log de Consulta Cola de Impresion ' + json);
          if (JSON.stringify(json) == '0') {
            fetchSentCarnet();
          }
          else {
            printingCarnet();
            setPrintOk(true);
          }
          setLoading(false);
        }

        const callBackError = (error) => {
          console.error(error);
          setLoading(false);
          messageError("revice su conexión a internet e inténtelo de nuevo");
        }

        let url  = `https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/wsconsultarcolaimpresion.php?IDPersona=${IDCarnet}`

        MyCustomFetch2({
          callbackOk,
          callBackError,
          callBackStateLoaddingTrue,
          callBackStateLoadingFalse,
          url,
        });


      }

      const fetchSentCarnet = () =>{//todo:FETCH de Impresión

        const callbackOk = (json) => {
          // console.log(json);
          if (JSON.stringify(json) == '"1"') {
            messageSuccess("¡Su petición de impresión ha sido enviada!");
            setPrint(true);
            // setPrintOk(true);
          }
          else {
            messageError("Su petición de impresión no fue enviada");
          }
          setLoading(false);
        }

        const callBackError = (error) => {
          console.error(error);
          setLoading(false);
          messageError("revice su conexión a internet e inténtelo de nuevo");
        }

        const formData = new FormData(); 
        formData.append("IDPersona", IDCarnet) //? add ID either employee or student
        formData.append("Salida", Carnet.toUpperCase()) //? Carnet has to be in uppecase beause that is how it is received from de server side
        formData.append("WorkzoneId", selectedId) //? this will serve for configure the printing zone

        let url  = `https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/registrarencolaimpresion.php`

        MyCustomFetch({
          callbackOk,
          callBackError,
          callBackStateLoaddingTrue,
          callBackStateLoadingFalse,
          formData,
          url,
          FetchPlace
        });

      }

      const fetchDeleteCarnet = () => {//todo:FETCH Delete Printing

        const callbackOk = (json) => {
          // console.log(json);
          if (JSON.stringify(json) != '0') {
            fetchSentCarnet();
          }
          else {
            messageError("Ocurrió un error al procesar su petición");
          }
          setLoading(false);
        }

        const callBackError = (error) => {
          console.error(error);
          setLoading(false);
          messageError("revice su conexión a internet e inténtelo de nuevo");
        }

        let url  = `https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/wseliminardecolaimpresion.php?IDPersona=${IDCarnet}`

        MyCustomFetch2({
          callbackOk,
          callBackError,
          callBackStateLoaddingTrue,
          callBackStateLoadingFalse,
          url,
        });
      }

      const printingCarnet = () => {// Alert of Descision 

        // getData(); // getting asyncstorage value

        // alert(JSON.stringify(printOk));

        if(selectedId !== null){  // selectedId de zona de trabajo

            Alert.alert(
              'Información',
              'Ya hay una petición de impresión enviada, ¿desea eliminar y volver a enviar? Pulse OK.',
              [
                  {
                      text: 'Cancelar',
                    // algo
                    onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                  },
                  {text: 'OK',
                  onPress: ()=> [ fetchDeleteCarnet()]
                },
              ]
            );
        }
        else {
          Alert.alert("Información","Para imprimir, primero debe configurar su zona de trabajo. vaya a Configuración.")
        }
      }

      const fetch_updating = async () => { //todo: FETCH updating photo

        const callbackOk = (json) => {
            console.log(json);
            if (JSON.stringify(json) == '"1"') {
              messageSuccess("¡Su carnet ha sido actualizado!");
              setPrint(true);
            } else {
              messageError("Su carnet no ha sido actualizado");
            }
            setLoading(false);
        }

        const callBackError = (error) => {
          console.error(error);
          setLoading(false);
          messageError("Su carnet no ha sido actualizado");
        }

        const formData = new FormData();
          formData.append("IDCarnet", IDCarnet) //? add ID either employee or student
          formData.append("Foto", image) //? add Photo either employee or student

        let mod="";

        if (Carnet == "Estudiante") {
          mod = "actualizarfotoestudiante";
        }
        else {
          mod = "actualizarfoto";
        }

        let url = `https://ws.usonsonate.edu.sv/wscarnetvirtual/ws/${mod}.php`;

        MyCustomFetch({
          callbackOk,
          callBackError,
          callBackStateLoaddingTrue,
          formData,
          url,
          FetchPlace
        });

      };

      const OpeningCamera = async () => { //? Camera permissions
        //here is how we can get the camera permission

        const cameraPermission = await Camera.requestCameraPermissionsAsync();

        setCameraPermission(cameraPermission.status === 'granted');

        const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
        // console.log(imagePermission.status);
        setGalleryPermission(imagePermission.status === 'granted');
        if (
          imagePermission.status !== 'granted' &&
          cameraPermission.status !== 'granted'
        ) {
          Alert.alert('Se necesita permiso para acceder a los medios.');
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
            aspect: [4, 4], // 4,4 getting the best format
            quality: 0.5,
            base64: true
          })

          if (CameraType === Camera.Constants.Type.front) {
            alert('hey!')
            data = await manipulateAsync(
              data.localUri || data.uri,
                [
                    { rotate: 180 },
                    { flip: FlipType.Vertical },
                ],
                { compress: 1, format: SaveFormat.PNG }
            );
          }

        // setFrontProfile(photo.uri);

          // console.log(image); // cadena base64 obtenida del state image
          setImage(data.base64) //? asignando la foto tomada, para guardarla
          // console.log(data.uri); // uri de foto obtenida
          setSelectedImage(data.uri); //? asignando la foto tomada, para visualizarla
          setPrint(false); //? ocultando el botón de imprimir
        }

      };

      const OpeningGalery = async () => {

        // console.log("Async Value: ", selectedId);

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4], // 4,4 mantienen el el formato ideal
          quality: 0.5,
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

      const MyColorTextDescription = () => {
        return { color: Carnet == "Estudiante" ? "#2EA1F0" : "#28B463" };
      };

      async function savePicture(){
        const asset = await MediaLibrary.createAssetAsync(selectedImage)
        .then( ()=>{
          alert('Fotografía guardada')
        })
        .catch( error=> {
          console.log('err', error);
        })
      }

      if (MisPermisos !== false && selectedImage == null) { //todo: Screen Open Camera
        return (
          <View style={styles.container}>
            <MyCamera type = {type}/>
            {/* <View style={styles.cameraContainer}>
                <Camera
                  ref={(ref) => setCamera(ref)}
                  style={styles.fixedRatio}
                  type={type}
                  ratio={"2:2"}
                  // useCamera2Api={true}
                  // ratio={"1,1"}
                />
            </View> */}
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
              visible={loading}
              textContent={"Cargando..."}
              textStyle={styles.spinnerTextStyle}
            />

            <Text style={styles.ParamstextName}>{Nombre}</Text>
            <Text style={[styles.ParamstextDescription, MyColorTextDescription()]}>{Description}</Text>

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
                <TouchableOpacity onPress={fetchConsultColaImpresion}
                    style={[styles.touchstate, styles.touchPrint]}>
                {/* <TouchableOpacity onPress={printingCarnet}  */}
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
        <Spinner
              visible={loading}
              textContent={"Cargando..."}
              textStyle={styles.spinnerTextStyle}
            />
        <Text style={styles.ParamstextName}>{Nombre}</Text>
        <Text style={[styles.ParamstextDescription, MyColorTextDescription()]}>{Description}</Text>
          { JSON.stringify(Foto)!='""'?
            <Image style={styles.imageProfil}
                   source={{uri: `data:image/gif;base64,${Foto}`}}
             />
             :
            <Image style={[styles.imageProfil, styles.imageDefault]}
                   source={require('../assets/persona.png')}
             />
          }
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
              <TouchableOpacity
              // onPress={printingCarnet}
              onPress={fetchConsultColaImpresion}
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
    ParamstextName: {
      marginTop: 20,
      fontWeight: '500',
      fontSize: 16

    },
    ParamstextDescription: {
      marginTop: 7,
      marginBottom: 10,
      fontWeight: '400'
    },
    imageProfil: {
      width: 150,
      height: 200,
      borderRadius: 15,
      borderColor: "lightgray",
      borderWidth: 1,
      resizeMode: "cover",
      marginTop: 15,
    },
    imageDefault:{
      tintColor: 'lightgray',
      borderColor: 'lightgray'
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