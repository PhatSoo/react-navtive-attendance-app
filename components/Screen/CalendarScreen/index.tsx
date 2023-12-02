import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import {get_attendance} from '../../../api/users';

enum Status {
  NULL = 'NULL', // Default
  WORKING = 'WORKING', // Check in
  LEAVE = 'LEAVE', // Leave request
  UNAUTHORIZED_LEAVE = 'UNAUTHORIZED_LEAVE', // Leave not request
  LATE = 'LATE', // Check in late
  EARLY = 'EARLY', // Check out early
  BUSINESS_TRIP = 'BUSINESS_TRIP',
}

type Attendance = {
  _id: String;
  checkInTime: Date;
  checkOutTime: Date;
  workDate: Date;
  workShift: {
    shiftName: String;
  };
  status: Status;
};

const CalendarScreen = ({navigation}: any) => {
  const [daySelected, setDaySelected] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [listSchedule, setListSchedule] = useState<{
    [key: string]: {
      formattedDate: string;
      selectedColor: string;
    };
  } | null>({});
  const [dayDetails, setDayDetails] = useState([]);
  const [dateMarked, setDateMarked] = useState({});

  // Get attendance
  useEffect(() => {
    const get_attendances = async () => {
      const list: any = [];
      const res = await get_attendance();

      // const currentShift = await get_current_shift();

      if (res.data.success) {
        // Get data from API and push to "list"
        res.data.data.map((item: Attendance) => {
          const date = new Date(item.workDate);
          const formattedDate = date.toISOString().slice(0, 10);

          const data = {
            id: item._id,
            formattedDate,
            checkIn: item.checkInTime,
            checkOut: item.checkOutTime,
            status: item.status,
            shift: item.workShift.shiftName,
          };

          list.push(data);
        });

        const markedDates = list.reduce(
          (
            acc: {[key: string]: {selectedColor: string; selected: boolean}},
            date: {status: string; formattedDate: string},
          ) => {
            switch (date.status) {
              case Status.NULL:
                if (new Date(date.formattedDate) > new Date()) {
                  acc[date.formattedDate] = {
                    selectedColor: 'gray',
                    selected: true,
                  };
                } else {
                  acc[date.formattedDate] = {
                    selectedColor: 'red',
                    selected: true,
                  };
                }
                break;
              case Status.WORKING:
                acc[date.formattedDate] = {
                  selectedColor: 'yellow',
                  selected: true,
                };
                break;
              default:
                acc[date.formattedDate] = {
                  selectedColor: 'green',
                  selected: true,
                };
                break;
            }

            return acc;
          },
          {},
        );

        setDateMarked(markedDates);
        setListSchedule(list);
      }
    };

    get_attendances();
  }, []);

  const handleForm = () => {
    navigation.navigate('Form', {daySelected});
  };

  const handleOpenDetails = () => {
    if (daySelected) {
      let result: any = [];
      for (let key in listSchedule) {
        if (listSchedule[key].formattedDate === daySelected) {
          result[key] = listSchedule[key];
        }
      }

      if (result.length === 0) {
        Alert.alert(
          'Thông báo',
          `Bạn không có ca làm trong ngày ${daySelected}`,
        );
        return;
      }
      setModalOpen(true);
      setDayDetails(result);
    }
  };

  const countTotalTime = (checkIn: string, checkOut: string) => {
    // Phân tách chuỗi thành giờ, phút, giây và chuyển đổi sang số giây
    const convertToSeconds = (timeString: string) => {
      if (timeString) {
        const [hours, minutes, seconds] = timeString
          .split(':')
          .map((x: string) => parseInt(x, 10));
        return hours * 3600 + minutes * 60 + seconds;
      }
      return 0;
    };

    if (checkIn && checkOut) {
      const time1InSeconds = convertToSeconds(checkIn);
      const time2InSeconds = convertToSeconds(checkOut);

      // Tính chênh lệch giữa hai thời gian
      const diffInSeconds = Math.abs(time2InSeconds - time1InSeconds);

      // Chuyển đổi chênh lệch thành giờ, phút, giây
      const hoursDiff = Math.floor(diffInSeconds / 3600);
      const minutesDiff = Math.floor((diffInSeconds % 3600) / 60);
      const secondsDiff = diffInSeconds % 60;
      return `${hoursDiff} giờ, ${minutesDiff} phút, ${secondsDiff} giây`;
    }
    return '';
  };

  const renderModalDetails = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalOpen(false)}
        visible={modalOpen}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>{daySelected}</Text>
              <ScrollView>
                <View style={styles.modalContent}>
                  {dayDetails &&
                    dayDetails.map((item: any) => (
                      <View key={item.id}>
                        <Text>{item.shift}:</Text>
                        <View style={styles.modalGroup}>
                          <Text style={styles.modalLabel}>Check in:</Text>
                          <Text style={styles.modalText}>
                            {new Date(item.checkIn).toLocaleTimeString()}
                          </Text>
                        </View>
                        <View style={styles.separate} />

                        <View style={styles.modalGroup}>
                          <Text style={styles.modalLabel}>Check out:</Text>
                          <Text style={styles.modalText}>
                            {new Date(item.checkOut).toLocaleTimeString()}
                          </Text>
                        </View>
                        <View style={styles.separate} />

                        <View style={styles.modalGroup}>
                          <Text style={styles.modalLabel}>Total:</Text>
                          <Text style={styles.modalText}>
                            {countTotalTime(item.checkOut, item.checkIn)}
                          </Text>
                        </View>
                        <View style={styles.separate} />

                        <View style={styles.modalGroup}>
                          <Text style={styles.modalLabel}>Status:</Text>
                          <Text style={styles.modalText}>{item.status}</Text>
                        </View>
                        <View style={styles.separate} />
                      </View>
                    ))}
                </View>
              </ScrollView>
              <TouchableOpacity
                style={[styles.button, {alignSelf: 'center'}]}
                onPress={() => setModalOpen(false)}>
                <Text style={styles.buttonText}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        onDayPress={day => {
          setDaySelected(day.dateString);
        }}
        markedDates={{
          ...dateMarked,
          [daySelected]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: '#5EDFFF',
          },
        }}
      />
      <View style={styles.contentContainer}>
        <View style={styles.noteGroup}>
          <Text style={styles.label}>Chú thích:</Text>
          <View>
            <View style={styles.note}>
              <View style={[styles.square, {backgroundColor: 'green'}]} />
              <Text>Đã chấm công</Text>
            </View>
            <View style={styles.note}>
              <View style={[styles.square, {backgroundColor: 'yellow'}]} />
              <Text>Đang làm</Text>
            </View>
            <View style={styles.note}>
              <View style={[styles.square, {backgroundColor: 'red'}]} />
              <Text>Không chấm công</Text>
            </View>
            <View style={styles.note}>
              <View style={[styles.square, {backgroundColor: 'gray'}]} />
              <Text>Ngày đi làm</Text>
            </View>
          </View>
        </View>
        {daySelected && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleOpenDetails}>
              <Text style={styles.buttonText}>Xem chi tiết</Text>
            </TouchableOpacity>
            {new Date(daySelected) > new Date() && (
              <TouchableOpacity style={styles.button} onPress={handleForm}>
                <Text style={styles.buttonText}>Làm đơn xin phép</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {renderModalDetails()}
    </SafeAreaView>
  );
};

export default CalendarScreen;
