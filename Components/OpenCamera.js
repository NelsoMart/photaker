import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function Add({ navigation }) {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const permisionFunction = async () => {
    // here is how you can get the camera permission
    const cameraPermission = await Camera.requestPermissionsAsync();

    setCameraPermission(cameraPermission.status === 'granted');

    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    console.log(imagePermission.status);

    setGalleryPermission(imagePermission.status === 'granted');

    if (
      imagePermission.status !== 'granted' &&
      cameraPermission.status !== 'granted'
    ) {
      alert('Permission for media access needed.');
    }
  };

  useEffect(() => {
    permisionFunction();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log(data.uri);
      setImageUri(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  return (
    <View style={styles.container}>
    
      { imageUri ==null?
        <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'}
        />
      </View>
      :
       null
      }

      <Button title={'Take Picture'} onPress={takePicture} />
      <Button title={'Gallery'} onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ flex: 1 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  button: {
    flex: 0.1,
    padding: 10,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
});


/*
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [height, setHeith] = useState(null);
  const [uri, setMyUri] = useState(null);
  const [img64, setImg64] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, [uri]);

  const 
  
  _takePhoto = async () => {
    const photo = await ref.current.takePictureAsync({
      base64: true,
      aspect: [3, 4],
      quality: 0.1,
    }).then(data => {
      setImg64(data.base64);
      // setMyUri(data.uri)
      // console.log(data.base64);
      });

    console.debug(photo); 
    // setMyPhoto(photo->);
    const {height, uri} = photo;
    setHeith(height);
    setMyUri(uri);
    //  console.log(img64);
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <View style={{flex:1, marginTop: 200, }}>
    <Text>No access to camera</Text>
    </View>
    );
    
  }
  if(uri !== null){
    return(
    <View>
      <Text>
        You are going to right !
      </Text>
    </View>
    )
  }
  return (
    <View style={{ flex: 2, marginVertical:200, marginHorizontal: 60 }}>
      <Camera style={{ flex: 2 }} type={type} ref={ref}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}>
            
        </View>
      </Camera>
      <View style={{flexDirection:'row'}}>
      <TouchableOpacity
            style={{
              flex: 1,
              // alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'black' }}> flip </Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={{
              // flex: 0.1,
              // alignSelf: 'flex-end',
              alignItems: 'center',
            }}
           onPress={_takePhoto}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'black' }}> Take </Text>
          </TouchableOpacity>
        
      <TouchableOpacity
          style={{
              flex: 1,
              // alignSelf: 'flex-end',
              alignItems: 'center',
            }}
           onPress={_takePhoto}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'red' }}> {height} </Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}
*/



/*
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImgToBase64 from 'react-native-image-base64';


export default function App() {

    const [selectedImage, setSelectedImage] = React.useState(null);
    const [image, setImage] = React.useState('')
    const [MyUrl, setMyUrl] = React.useState('')

  let openImagePickerAsync = async () => {

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    // console.log(pickerResult);

    const {uri} = pickerResult;

    setMyUrl(uri);

        // ImgToBase64.getBase64String(MyUrl)
        // .then(base64String => 
        //   // doSomethingWith(base64String)
        //   // Alert.alert(base64String),
        //   console.log(base64String)
        // )

        ImgToBase64.getBase64String(MyUrl, (err, base64string) => 
        console.log(ImgToBase64));


    console.log(MyUrl);



    if (pickerResult.cancelled === true) {
      return;
    }
    setSelectedImage({ localUri: pickerResult.uri });
  };

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
      <Image style={styles.image} source={{ uri: selectedImage.localUri }} />
      <View style={styles.row}>
        <Button onPress={openImagePickerAsync}>Gallery</Button>
         <Button 
        //  onPress={this.takePicture}
         >Camera</Button> 
      </View>
    </View>
    );

  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: image }} />
      <View style={styles.row}>
        <Button onPress={openImagePickerAsync}>Gallery</Button>
         <Button 
        //  onPress={this.takePicture}
         >Camera</Button> 
      </View>
    </View>
  );
}

const Button = ({ onPress, children }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
     logo:{
      width: 200,
      height: 200,
     },
     thumbnail: {
      width: 300,
      height: 300,
      resizeMode: "contain"
    },
    text: {
      fontSize: 21,
    },
    row: { flexDirection: 'row' },
    image: { width: 300, height: 300, backgroundColor: 'gray' },
    button: {
      padding: 13,
      margin: 15,
      backgroundColor: '#dddddd',
    },
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
})
*/


/*
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { ImagePicker, Permissions } from 'expo';

export default class App extends React.Component {
  state = {
    image: null,
  };

  selectPicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      aspect: 1,
      allowsEditing: true,
    });
    if (!cancelled) this.setState({ image: uri });
  };

  takePicture = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    const { cancelled, uri } = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });
    this.setState({ image: uri });
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: this.state.image }} />
        <View style={styles.row}>
          <Button onPress={this.selectPicture}>Gallery</Button>
          <Button onPress={this.takePicture}>Camera</Button>
        </View>
      </View>
    );
  }
}

const Button = ({ onPress, children }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 21,
  },
  row: { flexDirection: 'row' },
  image: { width: 300, height: 300, backgroundColor: 'gray' },
  button: {
    padding: 13,
    margin: 15,
    backgroundColor: '#dddddd',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/










// import React, { useState, useEffect, useRef } from 'react';
// import { Text, View, TouchableOpacity, Alert } from 'react-native';
// import { Camera } from 'expo-camera';
// import * as FileSystem from 'expo-file-system';
// import ImgToBase64 from 'react-native-image-base64';



// export default function OpenCamera() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [type, setType] = useState(Camera.Constants.Type.back);
//   const [height, setHeith] = useState('');
//   const [uri, setMyUri] = useState('');
//   const ref = useRef(null)

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);


//   // contabilidad
//   // presupuesto
//   // inventario fijo -> 
//   // 
//   _takePhoto = async () => {
//     const photo = await ref.current.takePictureAsync()
//     console.debug(photo);
//     // setMyPhoto(photo->);
//     const {height, uri} = photo;
//     setHeith(height);
//     setMyUri(uri);

//     ImgToBase64.getBase64String(uri)
//   .then(base64String => 
//     // doSomethingWith(base64String)
//     Alert.alert(base64String),
//     // console.log(base64String)
//     )
//   // .catch(err => doSomethingWith(err));

//     // const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
//     // console.debug(base64);
//   }

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return (
//       <View style={{flex:1, marginTop: 200, }}>
//     <Text>No access to camera</Text>
//     </View>
//     );
    
//   }
//   return (
//     <View style={{ flex: 2, marginVertical:200, marginHorizontal: 60 }}>
//       <Camera style={{ flex: 2 }} type={type} ref={ref}>
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: 'transparent',
//             flexDirection: 'row',
//           }}>
            
//         </View>
//       </Camera>
//       <View style={{flexDirection:'row'}}>
//       <TouchableOpacity
//             style={{
//               flex: 1,
//               // alignSelf: 'flex-end',
//               alignItems: 'center',
//             }}
//             onPress={() => {
//               setType(
//                 type === Camera.Constants.Type.back
//                   ? Camera.Constants.Type.front
//                   : Camera.Constants.Type.back
//               );
//             }}>
//             <Text style={{ fontSize: 18, marginBottom: 10, color: 'black' }}> flip </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//           style={{
//               // flex: 0.1,
//               // alignSelf: 'flex-end',
//               alignItems: 'center',
//             }}
//            onPress={_takePhoto}>
//             <Text style={{ fontSize: 18, marginBottom: 10, color: 'black' }}> Take </Text>
//           </TouchableOpacity>
        
//       <TouchableOpacity
//           style={{
//               flex: 1,
//               // alignSelf: 'flex-end',
//               alignItems: 'center',
//             }}
//            onPress={_takePhoto}>
//             <Text style={{ fontSize: 10, marginBottom: 10, color: 'red' }}> {uri} </Text>
//           </TouchableOpacity>
//       </View>
//     </View>
//   );
// }


// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
// } from "react-native";
// import { Camera } from "expo-camera";
// import { Button } from "react-native-paper";
// const CameraModule = (props) => {
//    const [cameraRef, setCameraRef] = useState(null);
//    const [type, setType] = useState(Camera.Constants.Type.back);
// return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={true}
//       onRequestClose={() => {
//         props.setModalVisible();
//       }}
//     >
//       <Camera
//         style={{ flex: 1 }}
//         ratio="16:9"
//         flashMode={Camera.Constants.FlashMode.on}
//         type={type}
//         ref={(ref) => {
//           setCameraRef(ref);
//         }}
//       >
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: "transparent",
//             justifyContent: "flex-end",
//           }}
//         >
//           <View
//             style={{
//               backgroundColor: "black",
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <Button
//               icon="close"
//               style={{ marginLeft: 12 }}
//               mode="outlined"
//               color="white"
//               onPress={() => {
//               props.setModalVisible();
//               }}
//             >
//               Close
//             </Button>
//            <TouchableOpacity
//               onPress={async () => {
//                 if (cameraRef) {
//                   let photo = await cameraRef.takePictureAsync();
//                   props.setImage(photo);
//                   props.setModalVisible();
//                 }
//               }}
//             >
//               <View
//                 style={{
//                   borderWidth: 2,
//                   borderRadius: 50,
//                   borderColor: "white",
//                   height: 50,
//                   width: 50,
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   marginBottom: 16,
//                   marginTop: 16,
//                 }}
//               >
//                 <View
//                   style={{
//                     borderWidth: 2,
//                     borderRadius: 50,
//                     borderColor: "white",
//                     height: 40,
//                     width: 40,
//                     backgroundColor: "white",
//                   }}
//                 ></View>
//               </View>
//             </TouchableOpacity>
//        <Button
//               icon="axis-z-rotate-clockwise"
//               style={{ marginRight: 12 }}
//               mode="outlined"
//               color="white"
//               onPress={() => {
//                 setType(
//                   type === Camera.Constants.Type.back
//                     ? Camera.Constants.Type.front
//                     : Camera.Constants.Type.back
//                 );
//               }}
//             >
//            {type === Camera.Constants.Type.back ? "Front" : "Back "}
//             </Button>
//           </View>
//         </View>
//       </Camera>
//     </Modal>
//   );
// };

// export default function ImagePickerExample() {
//   const [image, setImage] = useState(null);
//   const [camera, setShowCamera] = useState(false);
//   const [hasPermission, setHasPermission] = useState(null);
// useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);
// if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }
// return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <View
//         style={{
//           backgroundColor: "#eeee",
//           width: 120,
//           height: 120,
//           borderRadius: 100,
//           marginBottom: 8,
//         }}
//       >
//         <Image
//           source={{ uri: image }}
//           style={{ width: 120, height: 120, borderRadius: 100 }}
//         />
//       </View>
//       <Button
//         style={{ width: "30%", marginTop: 16 }}
//         icon="camera"
//         mode="contained"
//         onPress={() => {
//           setShowCamera(true);
//         }}
//       >
//         Camera
//       </Button>
//     {camera && (
//         <CameraModule
//           showModal={camera}
//           setModalVisible={() => setShowCamera(false)}
//           setImage={(result) => setImage(result.uri)}
//         />
//       )}
//     </View>
//   );
// }