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
import {
  check,
  check_local_wifi,
  get_existing_shift,
  get_info,
  get_time_of_fulltime,
} from '../../../api/users';
import {get_current_shift} from '../../../api/shifts';
import moment from 'moment';
import Loading from '../../Modals/Loading';

type Shift = {
  _id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
};

type Attendance = {
  _id: string;
  employee: {
    _id: string;
    isPartTime: boolean;
  };
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
  const [isPartTime, setIsPartTime] = useState<boolean | null>(null);
  const [checkNetwork, setCheckNetwork] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await get_info();
      if (res?.data.success) {
        setIsPartTime(res.data.data.isPartTime);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const check_wifi = async () => {
      return await check_local_wifi().then(r => {
        if (r) {
          setCheckNetwork(true);
        } else {
          Alert.alert(
            'Thông báo',
            'Bạn hãy sử dụng wifi của công ty để sử dụng chức năng này nhé!',
            [{text: 'OK', onPress: () => navigation.goBack()}],
          );
        }
      });
    };
    check_wifi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get info about current shift
  useEffect(() => {
    if (!checkType && isPartTime !== null) {
      if (isPartTime) {
        const get_currentShift = async () => {
          const currentShift = await get_current_shift();
          if (currentShift && currentShift.success) {
            setShiftInfo(currentShift.data);

            const isAttendance = await get_existing_shift(
              currentShift.data._id,
            );

            if (isAttendance && isAttendance.success) {
              setAttendanceInfo({success: true, data: {...isAttendance.data}});
            } else {
              setAttendanceInfo({success: false, message: isAttendance});
            }
          }
        };
        get_currentShift();
      } else {
        const get_fulltime_shift = async () => {
          const fulltimeShift: {startTime: string; endTime: string} =
            await get_time_of_fulltime();

          setShiftInfo({...fulltimeShift, _id: 'null', shiftName: ''});

          const isAttendance = await get_existing_shift('null');

          if (isAttendance && isAttendance.success) {
            setAttendanceInfo({success: true, data: {...isAttendance.data}});
          } else {
            setAttendanceInfo({success: false, message: isAttendance});
          }
        };

        get_fulltime_shift();
      }
    }
  }, [checkType, isPartTime]);

  const sendImage = async (data: any) => {
    // Gửi ảnh lên server
    const uri = data.uri;
    const parts = uri.split('/');
    const filename = parts[parts.length - 1];

    try {
      const formData = new FormData();
      formData.append('checkType', checkType);
      formData.append('attendanceId', attendanceInfo?.data?._id);
      formData.append('image', {
        name: filename,
        uri,
        type: 'image/jpeg', // Loại ảnh bạn muốn gửi
      });

      const result = await check(formData);

      setLoading(false);
      if (result?.data.success) {
        setIsCheckInOK(true);
        Alert.alert('Thông báo', 'Bạn đã chấm công thành công');
      } else {
        setIsCheckInOK(false);
        Alert.alert('Thông báo', 'Bạn đã chấm công thất bại');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

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

  const renderCheckOptions = () => {
    return (
      <View style={styles.container}>
        {shiftInfo ? (
          <>
            {isPartTime ? (
              <View style={styles.section}>
                <Text style={styles.title}>Ca hiện tại</Text>
                <Text style={styles.text}>{shiftInfo.shiftName}</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.title}>Ngày hiện tại</Text>
                <Text style={styles.text}>
                  {moment(new Date()).format('DD-MM-YYYY')}
                </Text>
              </View>
            )}

            <View style={styles.separator} />

            {isPartTime ? (
              <View style={styles.section}>
                <Text style={styles.title}>Thông tin ca làm</Text>
                <Text style={styles.text}>
                  Thời gian bắt đầu: {shiftInfo.startTime.toString()}h
                </Text>
                <Text style={styles.text}>
                  Thời gian kết thúc: {shiftInfo.endTime.toString()}h
                </Text>
              </View>
            ) : (
              <View style={styles.section}>
                <Text style={styles.title}>Thông tin ca làm</Text>
                <Text style={styles.text}>
                  Thời gian bắt đầu: {shiftInfo.startTime.toString()}h
                </Text>
                <Text style={styles.text}>
                  Thời gian kết thúc: {shiftInfo.endTime.toString()}h
                </Text>
              </View>
            )}

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
              {attendanceInfo?.success && checkNetwork ? (
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
        {!checkNetwork && <Loading isLoading={!checkNetwork} />}
        {checkType ? renderCamera() : renderCheckOptions()}
      </View>
    </LinearGradient>
  );
};

export default Attendance;
