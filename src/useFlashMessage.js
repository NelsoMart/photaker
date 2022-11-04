//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";


// create a component
const DispachMessage = () => {

    const messageError = (description) => {
       showMessage({
            message: "ERROR",
            type: "danger",
            description: description,
            position: "top",
            titleStyle: {paddingTop: 40}
          });
    }

    const messageWarning = (description) => {
        showMessage({
            message: "ADVERTENCIA",
            type: "warning",
            description: description,
            position: "bottom",
          });
    }

    const messageSuccess = (description) => {
        showMessage({
            message: "NOTIFICACIÓN",
            type: "success",
            description: description,
            position: "bottom",
            // titleStyle: {paddingTop: 40}
          });
    }

    return {
            messageError,
            messageSuccess,
            messageWarning
    }
};

//make this component available to the app
export default DispachMessage;