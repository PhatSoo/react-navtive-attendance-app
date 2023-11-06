import React, {useEffect, useState} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from './styles';
import {get_shift} from '../../api/shifts';

type Shifts = {
  shiftName: string;
  startTime: number;
  endTime: number;
};

const ShiftInformation = () => {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [shifts, setShifts] = useState<Shifts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const get_shifts = async () => {
      setLoading(true);
      const res = await get_shift();
      setShifts(res.data.data);
      setLoading(false);
    };
    get_shifts();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => setInfoModalVisible(true)}>
        <Icon name="information-circle-outline" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        visible={infoModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setInfoModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Thời gian làm của các ca:</Text>
            {shifts &&
              shifts.map(item => (
                <Text key={item.shiftName}>
                  - {item.shiftName}: {item.startTime}h-{item.endTime}h
                </Text>
              ))}

            <Text style={styles.note}>
              Lưu ý: nếu không chọn thì mặc định nhân viên sẽ rảnh toàn bộ ngày.
            </Text>
            <Text> - Nếu không làm thì cứ bấm xác nhận.</Text>
            <TouchableOpacity
              onPress={() => setInfoModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ShiftInformation;
