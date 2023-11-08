import React, {useEffect, useState} from 'react';
import {
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
  shiftRegistration: {
    workDate: Date;
    workShift: {
      shiftName: String;
    };
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

      if (res.data.success) {
        // Get data from API and push to "list"
        res.data.data.map((item: Attendance) => {
          const date = new Date(item.shiftRegistration.workDate);
          const formattedDate = date.toISOString().slice(0, 10);

          const data = {
            id: item._id,
            formattedDate,
            checkIn: item.checkInTime,
            checkOut: item.checkOutTime,
            status: item.status,
            shift: item.shiftRegistration.workShift.shiftName,
          };

          list.push(data);
        });

        // let markedDates: any = {};

        // list.forEach((item: any) => {
        //   if (item.status === Status.NULL) {
        //     markedDates[item.id] = {
        //       [item.formattedDate]: {selectedColor: 'gray', selected: true},
        //       checkIn: item.checkIn,
        //       checkOut: item.checkOut,
        //       status: item.status,
        //       shift: item.shift,
        //     };
        //   }
        // });

        const markedDates = list.reduce(
          (
            acc: {[key: string]: {selectedColor: string; selected: boolean}},
            date: {status: string; formattedDate: string},
          ) => {
            switch (date.status) {
              case Status.NULL:
                acc[date.formattedDate] = {
                  selectedColor: 'gray',
                  selected: true,
                };
                break;
              case Status.WORKING:
                acc[date.formattedDate] = {
                  selectedColor: 'yellow',
                  selected: true,
                };
                break;
              case Status.EARLY:
                acc[date.formattedDate] = {
                  selectedColor: 'red',
                  selected: true,
                };
                break;
              case Status.LATE:
                acc[date.formattedDate] = {
                  selectedColor: 'red',
                  selected: true,
                };
                break;
              case Status.LEAVE:
                break;
              case Status.UNAUTHORIZED_LEAVE:
                break;
              case Status.BUSINESS_TRIP:
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

  // Get attendance details
  useEffect(() => {}, []);

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
      setModalOpen(true);
      setDayDetails(result);
    }
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
              <Text>Chưa chấm công</Text>
            </View>
            <View style={styles.note}>
              <View style={[styles.square, {backgroundColor: 'red'}]} />
              <Text>Chấm công muộn</Text>
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

      <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalOpen(false)}
        visible={modalOpen}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>{daySelected}</Text>

              <View style={styles.modalContent}>
                <ScrollView>
                  {dayDetails &&
                    dayDetails.map((item: any) => (
                      <View key={item.id}>
                        <Text>{item.shift}:</Text>
                        <View style={styles.modalGroup}>
                          <Text style={styles.modalLabel}>Check in:</Text>
                          <Text style={styles.modalText}>{item.checkIn}h</Text>
                        </View>
                        <View style={styles.separate} />

                        <View style={styles.modalGroup}>
                          <Text style={styles.modalLabel}>Check out:</Text>
                          <Text style={styles.modalText}>{item.checkOut}h</Text>
                        </View>
                        <View style={styles.separate} />

                        <View style={styles.modalGroup}>
                          <Text style={styles.modalLabel}>Total:</Text>
                          <Text style={styles.modalText}>
                            {item.checkOut - item.checkIn}h
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
                </ScrollView>
              </View>

              <TouchableOpacity
                style={[styles.button, {alignSelf: 'center'}]}
                onPress={() => setModalOpen(false)}>
                <Text style={styles.buttonText}>Xong</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default CalendarScreen;
