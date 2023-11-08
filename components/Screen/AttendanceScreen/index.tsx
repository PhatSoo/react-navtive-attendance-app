import React, {useRef, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './styles';
import {RNCamera} from 'react-native-camera';
import FaceSDK, {
  ImageType,
  MatchFacesImage,
  MatchFacesRequest,
  MatchFacesResponse,
} from '@regulaforensics/react-native-face-api';

import LottieView from 'lottie-react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {attendance, get_attendance} from '../../../api/users';
import {API, ATTENDANCE_PATH} from '@env';

// interface BoxState {
//   boxes: {
//     width: any;
//     height: any;
//     x: any;
//     y: any;
//     yawAngle: any;
//     rollAngle: any;
//   };
// }

// Draw a box when face detected
// const bound = ({
//   width,
//   height,
//   x,
//   y,
// }: {
//   width: number;
//   height: number;
//   x: number;
//   y: number;
// }): ViewStyle => {
//   return {
//     position: 'absolute',
//     top: y,
//     left: x,
//     height,
//     width,
//     borderWidth: 5,
//     borderColor: 'red',
//     zIndex: 300,
//   };
// };

const Attendance = ({navigation}: any) => {
  const type = RNCamera.Constants.Type.front;
  // const [box, setBox] = useState<BoxState | null>(null);
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isCheckInOK, setIsCheckInOK] = useState(false);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  // const [checkType, setCheckType]

  const checkRecognize = (faceCapture: string) => {
    return new Promise(async (resolve, reject) => {
      const result = await attendance();
      const imageURL = API + '/' + ATTENDANCE_PATH + '/' + result.data.data;
      let imageBase64 = '';
      await RNFetchBlob.fetch('GET', imageURL)
        .then(res => {
          imageBase64 = res.base64();
        })
        .catch(err => console.error(err));

      const firstImage = new MatchFacesImage();
      firstImage.imageType = ImageType.PRINTED;
      firstImage.bitmap = imageBase64;

      const secondImage = new MatchFacesImage();
      secondImage.imageType = ImageType.PRINTED;
      secondImage.bitmap = faceCapture;

      const request = new MatchFacesRequest();
      request.images = [firstImage, secondImage];

      FaceSDK.matchFaces(
        JSON.stringify(request),
        matchFacesResponse => {
          const response = MatchFacesResponse.fromJson(
            JSON.parse(matchFacesResponse),
          );
          resolve(response);
        },
        e => {
          reject(e);
        },
      );
    });
  };

  const handleFace = async ({faces}: any) => {
    if (faces.length > 0 && !isTakingPicture) {
      setIsTakingPicture(true);
      // setBox({
      //   boxes: {
      //     width: faces[0].bounds.size.width,
      //     height: faces[0].bounds.size.height,
      //     x: faces[0].bounds.origin.x,
      //     y: faces[0].bounds.origin.y,
      //     yawAngle: faces[0].yawAngle,
      //     rollAngle: faces[0].rollAngle,
      //   },
      // });
      if (cameraRef.current) {
        const options = {
          pauseAfterCapture: true,
          base64: true,
          doNotSave: true,
          quality: 0.5,
        };
        try {
          const data = await cameraRef.current?.takePictureAsync(options);
          const base64 = data.base64;
          const res = await checkRecognize(base64);
          if (res.exception === null) {
            setLoading(false);
            if (res.results[0].similarity > 0.9) {
              setIsCheckInOK(true);
            }
          }
        } catch (error) {
          console.error('Error taking picture:', error);
        } finally {
          setIsTakingPicture(false);
        }
      }
    }
    // else {
    //   setBox(null);
    // }
    // }
  };
  return (
    <LinearGradient colors={['#ECFCFF', '#B2FCFF']} style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.top}>
          <RNCamera
            ref={cameraRef}
            type={type}
            captureAudio={false}
            style={styles.camera}
            onFacesDetected={handleFace}
          />
          {/* {box && (
            <View
              style={bound({
                width: box.boxes.width,
                height: box.boxes.height,
                x: box.boxes.x,
                y: box.boxes.y,
              })}
            />
          )} */}
        </View>
        <View style={styles.bottom}>
          {loading ? (
            <>
              <ActivityIndicator size={'large'} />
              <Text style={styles.text}>Đang xử lý</Text>
            </>
          ) : isCheckInOK ? (
            <>
              <LottieView
                source={require('../../../assets/animation/load-success.json')}
                loop
                autoPlay
                style={styles.anim}
              />
              <Text style={styles.text}>Hoàn thành</Text>
            </>
          ) : (
            <>
              <LottieView
                source={require('../../../assets/animation/load-failed.json')}
                loop
                autoPlay
                style={styles.anim}
              />
              <Text style={styles.text}>Thất bại</Text>
            </>
          )}
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.button, {marginRight: 20}]}>
              <Text style={styles.text}>Đăng ký ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.goBack()}>
              <Text style={styles.text}>Thoát</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Attendance;
