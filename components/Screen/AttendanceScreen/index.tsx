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

import LottieView from 'lottie-react-native';
import {check, get_existing_shift} from '../../../api/users';
import {get_current_shift} from '../../../api/shifts';

type Shift = {
  _id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
};

type Attendance = {
  _id: string;
  checkIn: {
    time: string;
  };
  checkOut: {
    time: string;
  };
  status: string;
};

const Attendance = ({navigation}: any) => {
  const type = RNCamera.Constants.Type.front;
  let cameraRef = useRef<RNCamera>(null);
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

  const sendImage = async (data: any) => {
    // Gửi ảnh lên server
    const uri = data.uri;
    const parts = uri.split('/');
    const filename = parts[parts.length - 1];

    try {
      const formData = new FormData();
      formData.append('image', {
        name: filename,
        uri,
        type: 'image/jpeg', // Loại ảnh bạn muốn gửi
      });
      formData.append('checkType', checkType);
      formData.append('attendanceId', attendanceInfo?.data?._id);

      const result = await check(formData);

      setLoading(false);
      if (result?.data.success) {
        setIsCheckInOK(true);
        Alert.alert('Thông báo', 'Bạn đã chấm công thành công');
      } else {
        Alert.alert('Thông báo', 'Bạn đã chấm công thất bại');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  console.log('====================================');
  console.log(cameraRef);
  console.log('====================================');

  const handleFace = async ({faces}: any) => {
    if (faces.length > 0 && !isTakingPicture) {
      setIsTakingPicture(true);

      if (cameraRef.current) {
        const options = {
          pauseAfterCapture: true,
          base64: false,
          quality: 1,
        };
        try {
          const data = await cameraRef.current.takePictureAsync(options);

          sendImage(data);
        } catch (error) {
          console.error('Error taking picture:', error);
        } finally {
          setIsTakingPicture(false);
        }
      }
    }
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
              onPress={() => {
                setCheckType('');
                setLoading(true);
              }}>
              <Text style={styles.text}>Thoát</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  // Get info about current shift
  useEffect(() => {
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
      if (cType === 'CheckIn' && attendanceInfo.data.checkIn.time) {
        Alert.alert(
          'Thông báo',
          `Bạn đã ${cType}\nVui lòng không chọn lại chức năng này!`,
        );
        return;
      } else if (cType === 'CheckOut' && attendanceInfo.data.checkOut.time) {
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
                {attendanceInfo?.data && attendanceInfo?.data.checkIn.time
                  ? attendanceInfo.data.checkIn.time
                  : 'NULL'}
              </Text>
              <Text style={styles.text}>
                Check-out:{' '}
                {attendanceInfo?.data && attendanceInfo?.data.checkOut.time
                  ? attendanceInfo.data.checkOut.time
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
              {attendanceInfo?.success ? (
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
