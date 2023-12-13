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
import moment from 'moment';

enum Status {
  NULL = 'NULL', // Default
  WORKING = 'WORKING', // Check in
  LEAVE = 'LEAVE', // Leave request
  DONE = 'DONE',
}

type Attendance = {
  _id: String;
  employee: {
    isPartTime: boolean;
  };
  checkIn: {
    time: string;
  };
  checkOut: {
    time: string;
  };
  workDate: Date;
  workShift?: {
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
  const [isPartTime, setIsPartTime] = useState(false);

  // Get attendance
  useEffect(() => {
    const get_attendances = async () => {
      const list: any = [];
      const res = await get_attendance();

      if (res.data.success) {
        // Get data from API and push to "list"
        res.data.data.map((item: Attendance) => {
          const date = new Date(item.workDate);
          const formattedDate = moment(date).format('YYYY-MM-DD');
          setIsPartTime(item.employee.isPartTime);

          const data = {
            id: item._id,
            formattedDate,
            checkIn: item.checkIn.time,
            checkOut: item.checkOut.time,
            status: item.status,
            shift: item.workShift ? item.workShift.shiftName : null,
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
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      const diffInSeconds =
        Math.abs(checkOutDate.getTime() - checkInDate.getTime()) / 1000;

      const hoursDiff = Math.floor(diffInSeconds / 3600);
      const minutesDiff = Math.floor((diffInSeconds % 3600) / 60);
      const secondsDiff = Math.round(diffInSeconds % 60);
      return `${hoursDiff} giờ, ${minutesDiff} phút, ${secondsDiff} giây`;
    }
    return 'N/A';
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
                        <Text>{item.shift}</Text>
                        <View style={styles.modalGroup}>
                          <Text style={styles.modalLabel}>Check in:</Text>
                          <Text style={styles.modalText}>
                            {item.checkIn
                              ? new Date(item.checkIn).toLocaleTimeString()
                              : 'N/A'}
                          </Text>
                        </View>
                        <View style={styles.separate} />

                        <View style={styles.modalGroup}>
                          <Text style={styles.modalLabel}>Check out:</Text>
                          <Text style={styles.modalText}>
                            {item.checkOut
                              ? new Date(item.checkOut).toLocaleTimeString()
                              : 'N/A'}
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
            {new Date(daySelected) > new Date() && !isPartTime && (
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
