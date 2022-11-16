//import liraries
import { showMessage, hideMessage } from "react-native-flash-message";

// create a component
const DispachMessage = () => {

    const messageError = (description) => {
       showMessage({
            message: "ERROR",
            type: "danger",
            description: description,
            position: "top",
            titleStyle: {paddingTop: 35}
          });
    }

    const messageWarning = (description) => {
        showMessage({
            message: "ADVERTENCIA",
            type: "warning",
            description: description,
            position: "bottom",
            titleStyle: {paddingBottom: 5}
          });
    }

    const messageSuccess = (description) => {
        showMessage({
            message: "NOTIFICACIÓN",
            type: "success",
            description: description,
            position: "bottom",
            titleStyle: {paddingBottom: 5}
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
