import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './styles';
import {CheckBox} from '@rneui/themed';
import {get_shift} from '../../../api/shifts';
import {get_schedule, schedule_chosen} from '../../../api/users';

type Shifts = {
  _id: string;
  shiftName: string;
  color: string;
};

const ScheduleScreen = () => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [nextWeekDays, setNextWeekDays] = useState<string[]>([]);
  const [shiftsInfo, setShiftsInfo] = useState<{[key: string]: string[]}>({});
  const [shifts, setShifts] = useState<Shifts[]>([]);
  const [shiftSummaryModalVisible, setShiftSummaryModalVisible] =
    useState(false);

  const handleCheckboxPress = (value: any, day: string) => {
    let updatedShiftsInfo = {...shiftsInfo};

    if (shiftsInfo[day].includes(value)) {
      updatedShiftsInfo[day] = updatedShiftsInfo[day].filter(
        item => item !== value,
      );
    } else {
      updatedShiftsInfo[day] = [...(updatedShiftsInfo[day] || []), value];
    }

    setShiftsInfo(updatedShiftsInfo);
  };

  // Get shifts available and set colors
  useEffect(() => {
    const get_shifts = async () => {
      const res = await get_shift();
      const colors = ['lightgreen', 'red', 'yellow'];

      const extractedShifts = res.data.data.map(
        (item: Shifts, idx: number) => ({
          _id: item._id,
          shiftName: item.shiftName,
          color: colors[idx],
        }),
      );

      setShifts(extractedShifts);
    };
    get_shifts();
  }, []);

  useEffect(() => {
    const today = new Date();
    const todayDayIndex = today.getDay();
    const daysUntilNextMonday = (8 - todayDayIndex) % 7;
    const nextMonday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + daysUntilNextMonday,
    );
    const nextWeek: string[] = [];

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(
        nextMonday.getFullYear(),
        nextMonday.getMonth(),
        nextMonday.getDate() + i,
        // today.getFullYear(),
        // today.getMonth(),
        // today.getDate() + i,
      );
      const dayString = `${nextDay.toLocaleDateString('vi-VN', {
        weekday: 'long',
      })}`;
      nextWeek.push(dayString);
    }

    const initialShiftsInfo: {[key: string]: string[]} = {};
    nextWeek.forEach(day => {
      initialShiftsInfo[day] = [];
    });

    setShiftsInfo(initialShiftsInfo);
    setNextWeekDays(nextWeek);

    // Get schedule that already regis from user
    const get_schedules = async () => {
      const schedules = await get_schedule();

      schedules.forEach((item: any) => {
        const dayString = new Date(item.workDate).toLocaleDateString('vi-VN', {
          weekday: 'long',
        });

        const shiftName = item.workShift.map(
          (shift: {shiftName: any}) => shift.shiftName,
        );

        if (nextWeek.includes(dayString)) {
          setShiftsInfo(prevState => ({
            ...prevState,
            [dayString]: [...prevState[dayString], ...shiftName],
          }));
        }
      });
    };

    get_schedules();
  }, []);

  const handleDaySelection = (day: string) => {
    setSelectedDay(day === selectedDay ? null : day);
  };

  const renderItem = ({item}: {item: string}) => {
    const isSelected = selectedDay === item;

    return (
      <TouchableOpacity
        style={[
          styles.dayButton,
          {backgroundColor: isSelected ? '#3E64FF' : '#5EDFFF'},
        ]}
        onPress={() => {
          handleDaySelection(item);
        }}>
        <Text
          style={[
            styles.buttonText,
            {color: isSelected ? '#000' : 'white', fontWeight: 'bold'},
          ]}>
          {item}
        </Text>
        {/* <View style={styles.statusContainer}> */}
        {shiftsInfo[item].length > 0 && (
          <View style={styles.statusContainer}>
            {shifts.map(
              shift =>
                shiftsInfo[item].some(ses => ses === shift.shiftName) && (
                  <View style={styles.statusItem} key={shift._id}>
                    <View
                      style={[
                        styles.dot,
                        {backgroundColor: shift.color || 'black'},
                      ]}
                    />
                    <Text style={styles.statusText}>{shift.shiftName}</Text>
                  </View>
                ),
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderShifts = () => {
    if (selectedDay) {
      return (
        <View style={styles.shiftContainer}>
          <Text style={styles.text}>Chọn ca làm cho ngày {selectedDay}:</Text>

          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            {shifts &&
              shifts.map((shift, index) => (
                <View
                  key={index}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/* <Checkbox
                    status={
                      shiftsInfo[selectedDay].includes(shift.shiftName)
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() =>
                      handleCheckboxPress(shift.shiftName, selectedDay)
                    }
                    color="pink"
                  /> */}
                  <CheckBox
                    checked={shiftsInfo[selectedDay].includes(shift.shiftName)}
                    onPress={() =>
                      handleCheckboxPress(shift.shiftName, selectedDay)
                    }
                    checkedColor="pink"
                  />
                  <Text>{shift.shiftName}</Text>
                </View>
              ))}
          </View>
        </View>
      );
    }
    return null;
  };

  const handleConfirm = async () => {
    let now = new Date();

    // Tìm ngày Chủ nhật cùng tuần
    let sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay() + 7);
    sunday.setHours(10, 10, 0, 0);

    const formatDate = (dateStr: string) => {
      const [, date] = dateStr.split(', ');
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}`;
    };

    // Kiểm tra xem now có <= 16h30 của ngày Chủ nhật cùng tuần không
    if (now <= sunday) {
      const groupedShifts: any[] = [];
      for (const [date, shiftsRegis] of Object.entries(shiftsInfo)) {
        if (shiftsRegis.length > 0) {
          const formattedDate = formatDate(date);
          const existingGroup = groupedShifts.find(
            item => item.workDate === formattedDate,
          );
          if (existingGroup) {
            existingGroup.workShift.push(...shiftsRegis);
          } else {
            groupedShifts.push({
              workDate: formattedDate,
              workShift: shiftsRegis,
            });
          }
        }
      }

      const response = await schedule_chosen(groupedShifts);
      if (response.data.success) {
        Alert.alert('Thông báo', response.data.message);
        setShiftSummaryModalVisible(false);
        return;
      }
      Alert.alert('Có lỗi xảy ra', response.data.message);
    } else {
      Alert.alert('Có lỗi xảy ra', 'Đã hết giờ đăng ký ca làm!');
    }

    return;
  };

  const renderShiftSummaryModal = () => {
    return (
      <Modal
        visible={shiftSummaryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShiftSummaryModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            {nextWeekDays.map(
              day =>
                shiftsInfo[day] &&
                shiftsInfo[day].length > 0 && (
                  <View key={day}>
                    <Text style={styles.modalText}>{day}</Text>
                    <Text>{shiftsInfo[day].join(' | ')}</Text>
                    <View style={styles.separator} />
                  </View>
                ),
            )}
            {nextWeekDays.every(
              day => !(shiftsInfo[day] && shiftsInfo[day].length > 0),
            ) && (
              <Text style={styles.modalText}>
                Bạn không chọn ca nào cho tuần sau!
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleConfirm()}
                style={styles.button}>
                <Text style={styles.modalConfirm}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShiftSummaryModalVisible(false)}
                style={styles.button}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderConfirmationButton = () => {
    return (
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => setShiftSummaryModalVisible(true)}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#00B5E2', '#3E64FF']} style={styles.container}>
      <View>
        <Text style={styles.text}>chọn ca làm</Text>
        <View style={styles.flatListContainer}>
          <FlatList
            data={nextWeekDays}
            renderItem={renderItem}
            keyExtractor={item => item}
          />
        </View>
      </View>
      {renderShifts()}
      {renderShiftSummaryModal()}
      {renderConfirmationButton()}
    </LinearGradient>
  );
};

export default ScheduleScreen;
