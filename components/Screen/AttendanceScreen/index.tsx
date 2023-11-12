import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {attendance, check, get_existing_shift} from '../../../api/users';
import {API, ATTENDANCE_PATH} from '@env';
import {get_current_shift} from '../../../api/shifts';
// import {get_current_time_format} from '../../../utils';

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

type Shift = {
  _id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
};

type Attendance = {
  _id: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
};

const Attendance = ({navigation}: any) => {
  const type = RNCamera.Constants.Type.front;
  // const [box, setBox] = useState<BoxState | null>(null);
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isCheckInOK, setIsCheckInOK] = useState(false);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [checkType, setCheckType] = useState('');
  const [shiftInfo, setShiftInfo] = useState<Shift | null>();
  const [attendanceInfo, setAttendanceInfo] = useState<{
    success: Boolean;
    data?: Attendance;
    message?: string;
  } | null>();
  // const [status, setStatus] = useState('');

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
            if (res.results[0].similarity > 0.9 && attendanceInfo) {
              setIsCheckInOK(true);

              // const status = compareHours(
              //   get_current_time_format(),
              //   shiftInfo.startTime,
              //   shiftInfo.endTime,
              // );

              const checks = await check(checkType, attendanceInfo._id);
              if (checks && checks.data.success) {
                setCheckType('');
                Alert.alert('Thông báo!', 'Bạn đã chấm công thành công.');
                return;
              }
            }
            Alert.alert('Thông báo!', 'Bạn đã chấm công thất bại.');
            return;
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

  const renderCamera = () => {
    return (
      <>
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
              <Text style={styles.statusText}>Đang xử lý</Text>
            </>
          ) : isCheckInOK ? (
            <>
              <LottieView
                source={require('../../../assets/animation/load-success.json')}
                loop
                autoPlay
                style={styles.anim}
              />
              <Text style={styles.statusText}>Hoàn thành</Text>
            </>
          ) : (
            <>
              <LottieView
                source={require('../../../assets/animation/load-failed.json')}
                loop
                autoPlay
                style={styles.anim}
              />
              <Text style={styles.statusText}>Thất bại</Text>
            </>
          )}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCheckType('')}>
              <Text style={styles.text}>Thoát</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  // const compareHours = (
  //   currentTime: string,
  //   startTime: string,
  //   endTime: string,
  // ) => {
  //   // Chuyển đổi chuỗi thời gian thành Date object
  //   const current = new Date('1970-01-01T' + currentTime + 'Z');
  //   const start = new Date('1970-01-01T' + startTime + 'Z');
  //   const end = new Date('1970-01-01T' + endTime + 'Z');

  //   if (checkType === 'CheckIn') {
  //     if (current > start) {
  //       return 'LATE';
  //     } else {
  //       return 'WORKING';
  //     }
  //   } else if (checkType === 'CheckOut') {
  //     if (current < end) {
  //       return 'EARLY';
  //     } else {
  //       return 'DONE';
  //     }
  //   } else {
  //     return 'NULL';
  //   }
  // };

  useEffect(() => {
    // Get info about current shift
    if (!checkType) {
      const get_currentShift = async () => {
        const currentShift = await get_current_shift();
        if (currentShift && currentShift.success) {
          setShiftInfo(currentShift.data);

          const isAttendance = await get_existing_shift(currentShift.data._id);
          if (isAttendance && isAttendance.success) {
            setAttendanceInfo({success: true, data: {...isAttendance.data}});
          } else {
            setAttendanceInfo({success: false, message: isAttendance});
          }
        }
      };
      get_currentShift();
    }
  }, [checkType]);

  const handleCheckPress = (cType: string) => {
    if (attendanceInfo?.success && attendanceInfo.data) {
      if (cType === 'CheckIn' && attendanceInfo.data.checkInTime) {
        Alert.alert(
          'Thông báo',
          `Bạn đã ${cType}\nVui lòng không chọn lại chức năng này!`,
        );
        return;
      } else if (cType === 'CheckOut' && attendanceInfo.data.checkOutTime) {
        Alert.alert(
          'Thông báo',
          `Bạn đã ${cType}\nVui lòng không chọn lại chức năng này!`,
        );
        return;
      } else {
        setCheckType(cType);
      }
    }
  };

  const renderCheckOptions = () => {
    return (
      <View style={styles.container}>
        {shiftInfo ? (
          <>
            <View style={styles.section}>
              <Text style={styles.title}>Ca hiện tại</Text>
              <Text style={styles.text}>{shiftInfo.shiftName}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.section}>
              <Text style={styles.title}>Thông tin ca làm</Text>
              <Text style={styles.text}>
                Thời gian bắt đầu: {shiftInfo.startTime.toString()}h
              </Text>
              <Text style={styles.text}>
                Thời gian kết thúc: {shiftInfo.endTime.toString()}h
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.section}>
              <Text style={styles.title}>Thông tin liên quan</Text>
              <Text style={styles.text}>
                Check-in:{' '}
                {attendanceInfo?.data && attendanceInfo?.data.checkInTime
                  ? attendanceInfo.data.checkInTime
                  : 'NULL'}
              </Text>
              <Text style={styles.text}>
                Check-out:{' '}
                {attendanceInfo?.data && attendanceInfo?.data.checkOutTime
                  ? attendanceInfo.data.checkOutTime
                  : 'NULL'}
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.section}>
              <Text style={styles.title}>Trạng thái chấm công</Text>
              <Text style={styles.text}>
                {attendanceInfo?.success && attendanceInfo.data
                  ? attendanceInfo?.data.status
                    ? attendanceInfo?.data.status
                    : 'Bạn chưa chấm công'
                  : 'Bạn không có ca làm trong hôm nay'}
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.bottom}>
              {attendanceInfo ? (
                <>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleCheckPress('CheckIn')}>
                    <Text style={styles.buttonText}>Check In</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleCheckPress('CheckOut')}>
                    <Text style={styles.buttonText}>Check Out</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Thoát</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.title}>Thông báo</Text>
              <Text style={styles.text}>
                Hiện tại đang không trong ca làm nào!
              </Text>
              <Text style={styles.text}>Hãy trở lại khi ở trong ca làm.</Text>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <LinearGradient colors={['#ECFCFF', '#B2FCFF']} style={styles.wrapper}>
      <View style={styles.container}>
        {checkType ? renderCamera() : renderCheckOptions()}
      </View>
    </LinearGradient>
  );
};

export default Attendance;
