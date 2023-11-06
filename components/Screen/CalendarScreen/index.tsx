import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import {get_attendance} from '../../../api/users';

type Atendance = {
  checkInTime: Date;
  checkOutTime: Date;
  shiftRegistration: {
    workDate: Date;
    workShift: {
      shiftName: String;
    };
  };
};

const CalendarScreen = ({navigation}: any) => {
  const [daySelected, setDaySelected] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [listSchedule, setListSchedule] = useState([]);

  useEffect(() => {
    const get_attendances = async () => {
      const list: Date[] = [];
      const res = await get_attendance();

      if (res.data.success) {
        res.data.data.map((item: Atendance) => {
          list.push(item.shiftRegistration.workDate);
        });
      }

      console.log('====================================');
      console.log(list);
      console.log('====================================');
    };

    get_attendances();
  }, []);

  const handleForm = () => {
    navigation.navigate('Form', {daySelected});
  };

  const data = {
    checkInTime: 8,
    checkOutTime: 17,
    status: 1,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        onDayPress={day => {
          setDaySelected(day.dateString);
        }}
        markedDates={{
          [daySelected]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: '#5EDFFF',
          },
          listSchedule: {
            selectedColor: '#000',
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalOpen(true)}>
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
                <View style={styles.modalGroup}>
                  <Text style={styles.modalLabel}>Check in:</Text>
                  <Text style={styles.modalText}>{data.checkInTime}h</Text>
                </View>
                <View style={styles.separate} />

                <View style={styles.modalGroup}>
                  <Text style={styles.modalLabel}>Check out:</Text>
                  <Text style={styles.modalText}>{data.checkOutTime}h</Text>
                </View>
                <View style={styles.separate} />

                <View style={styles.modalGroup}>
                  <Text style={styles.modalLabel}>Total:</Text>
                  <Text style={styles.modalText}>
                    {data.checkOutTime - data.checkInTime}h
                  </Text>
                </View>
                <View style={styles.separate} />

                <View style={styles.modalGroup}>
                  <Text style={styles.modalLabel}>Status:</Text>
                  <Text style={styles.modalText}>{data.status}</Text>
                </View>
                <View style={styles.separate} />
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
