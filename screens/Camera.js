//import liraries
import React, {  useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

import { Camera } from 'expo-camera';
import contextbase from '../contexts/ContextBase';

//* create component
const MyCamera = (props) => {

    const { cameraRegister } = useContext(contextbase);

    // const [type, setType] = useState(Camera.Constants.Type.back);
    const {type} = props
    useEffect(()=>{
        cameraRegister(Camera.ref)
    }, [])

    // console.log('un props type: ' + type)

    return (
          <View style={styles.cameraContainer}>
            <Camera
              ref={(ref) => cameraRegister(ref)}
              style={styles.fixedRatio}
              type={type}
              ratio={"2:2"}
            />
          </View>
    );
};

//* define styles
const styles = StyleSheet.create({

    cameraContainer: {
        flex: 1,
        flexDirection: "row",
      },
      fixedRatio: {
        flex: 1,
        aspectRatio: 1,
      }
      
});

//* make this component available to the app
export default MyCamera;
