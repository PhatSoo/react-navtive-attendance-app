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

  const renderShiftInfo = () => {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Thời gian làm của các ca:</Text>
          {shifts &&
            shifts.map(item => (
              <Text key={item.shiftName}>
                - {item.shiftName}:{' '}
                <Text style={{fontWeight: 'bold', fontStyle: 'italic'}}>
                  {item.startTime}h-{item.endTime}h
                </Text>
              </Text>
            ))}

          <Text style={styles.note}>
            Lưu ý: nếu không chọn thì mặc định nhân viên sẽ rảnh toàn bộ ngày.
          </Text>
          <Text> - Nếu không làm thì cứ bấm xác nhận.</Text>
          <Text>
            - Thời gian kết thúc là lúc{' '}
            <Text style={{fontWeight: 'bold'}}>16h30p</Text> ngày{' '}
            <Text style={{color: 'red'}}>Chủ Nhật</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setInfoModalVisible(false)}
            style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        {renderShiftInfo()}
      </Modal>
    </>
  );
};

export default ShiftInformation;
