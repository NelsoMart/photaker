//import liraries
import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import DispachMessage from '../src/useFlashMessage';


// create a component
const useFetch = () => {
  //* -------------- Deconstrucción de mis hooks ---------------
  const {
    messageWarning,
} = DispachMessage();
//* -----------------------------------------------------------


    const MyCustomFetch = (props) => {

        const {callbackOk, callBackError, url, formData, FetchPlace, 
                 callBackStateLoaddingTrue, callBackStateLoadingFalse} = props
        
        const options = {
            method: 'POST',
            headers: {
              Accept: 'application/form-data'
            },
            body: formData
          }

          // callBackStateLoaddingTrue();

          NetInfo.fetch().then((state) => {

            if (state.isConnected == true) {

              callBackStateLoaddingTrue(); 

              fetch(url, options)
              .then((response) => FetchPlace == "LikeGet"?response.json():response.text())
              .then((json) => {
                callbackOk(json)
              })
              .catch((error) => {
                callBackError(error)
              });
            } 
            else {
              messageWarning("Parece que no está conectado a la red");
              callBackStateLoadingFalse();
            } 
          })   
    }

    const MyCustomFetch2 = (props) => {

      const {callbackOk, callBackError, url, formData, FetchPlace, 
               callBackStateLoaddingTrue, callBackStateLoadingFalse} = props
      


        NetInfo.fetch().then((state) => {

          if (state.isConnected == true) {

            callBackStateLoaddingTrue(); 

            fetch(url)
            .then((response) => response.json())
            .then((json) => {
              callbackOk(json)
            })
            .catch((error) => {
              callBackError(error)
            });
          } 
          else {
            messageWarning("Parece que no está conectado a la red");
            callBackStateLoadingFalse();
          } 
        })   
  }

   return {
        MyCustomFetch,
        MyCustomFetch2
   }
};


//make this component available to the app
export default useFetch;
