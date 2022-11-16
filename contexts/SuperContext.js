
import React, { useEffect, useState } from 'react'
import Contextbase from './ContextBase'

export default function SuperContext(props) {
    
    const {children} = props;
    const [cameraRef, setCameraRef] = useState(null);

    // useEffect(()=>{
    //     console.log("Ha cambiado: " )
    // }, [cameraRef])

  return (
      <Contextbase.Provider value={{
        camera: cameraRef, // contain the state
        cameraRegister: (value) => setCameraRef(value)
      }}>
        {children}
      </Contextbase.Provider>
  )
}