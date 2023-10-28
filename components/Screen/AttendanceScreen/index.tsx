import React, {useRef, useState} from 'react';
import {Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import {RNCamera} from 'react-native-camera';

const Attendance = () => {
  const [type, setType] = useState(RNCamera.Constants.Type.front);
  const [box, setBox] = useState(null);
  const cameraRef = useRef(null);

  const handleFace = ({faces}) => {
    console.log('====================================');
    console.log(faces);
    console.log('====================================');

    if (faces[0]) {
      setBox({
        boxes: {
          width: faces[0].bounds.size.width,
          height: faces[0].bounds.size.height,
          x: faces[0].bounds.origin.x,
          y: faces[0].bounds.origin.y,
          yawAngle: faces[0].yawAngle,
          rollAngle: faces[0].rollAngle,
        },
      });
    } else {
      setBox(null);
    }
  };

  return (
    <LinearGradient colors={['#ECFCFF', '#B2FCFF']} style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.top}>
          <RNCamera
            type={type}
            captureAudio={false}
            style={styles.camera}
            onFacesDetected={handleFace}
          />
          {box && (
            <View
              style={styles.bound({
                width: box.boxes.width,
                height: box.boxes.height,
                x: box.boxes.x,
                y: box.boxes.y,
              })}
            />
          )}
        </View>
        <View style={styles.bottom}>
          <Text>Bottom content</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Attendance;
