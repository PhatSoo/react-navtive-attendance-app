import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {styles} from './styles';
import {useRoute} from '@react-navigation/native';
import {getOldRequest, sendFormRequest} from '../../../api/users';
import {BottomSheet, Button, ListItem} from '@rneui/themed';
import {IForm} from '../../../types/interface';

interface RouteParams {
  daySelected: string;
}

const FormScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [oldRequest, setOldRequest] = useState<IForm[]>([]);

  let startDate = new Date(new Date().setDate(new Date().getDate() + 1));
  const dayParam = useRoute().params as RouteParams;
  if (dayParam) {
    startDate = new Date(dayParam.daySelected);
  }

  const [endDate, setEndDate] = useState(startDate);
  const [showPicker, setShowPicker] = useState(false);
  const [reason, setReason] = useState('');

  const onChange = (event: any, selectedDate: any) => {
    setShowPicker(false);

    setEndDate(selectedDate);
  };

  const handleSubmit = async () => {
    // startDate, endDate, reason
    if (reason.trim().length === 0) {
      setReason('');
      Alert.alert('Thông báo', 'Hãy nhập lý do nghỉ của bạn');
      return;
    }

    const formData = {
      startDate,
      endDate,
      reason,
    };

    const response = await sendFormRequest(formData);
    const result = response?.data;
    if (result.success) {
      Alert.alert(
        'Thông báo',
        'Bạn đã gửi đơn xin nghỉ phép thành công!\nhãy đợi admin duyệt nhé!',
      );
    } else {
      Alert.alert('Thông báo', 'Có lỗi xảy ra vui lòng thử lại sau!');
    }
  };

  const openBottomSheet = async () => {
    setIsVisible(true);

    const response = await getOldRequest();
    if (response?.data.success) {
      setOldRequest(response.data.data);
    } else {
      Alert.alert('Thông báo', 'Có lỗi xảy ra vui lòng thử lại sau!');
      setIsVisible(false);
      return;
    }
  };

  const renderBottomSheet = () => {
    return (
      <BottomSheet modalProps={{}} isVisible={isVisible}>
        {oldRequest.map((l, i) => (
          <ListItem key={i} containerStyle={{backgroundColor: 'white'}}>
            <ListItem.Content>
              <ListItem.Title style={{color: '#000'}}>
                {`${new Date(l.startDate).toDateString()} - ${new Date(
                  l.endDate,
                ).toDateString()}`}
              </ListItem.Title>
              <ListItem.Subtitle>Trạng thái: {l.status}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
        <ListItem
          containerStyle={{backgroundColor: 'red'}}
          onPress={() => setIsVisible(false)}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#fff'}}>Cancel</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </BottomSheet>
    );
  };

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#ECFCFF', '#B2FCFF']}
          style={styles.container}>
          <View style={styles.wrapper}>
            <View style={styles.dateGroup}>
              <View style={styles.dateWrapper}>
                <Text style={styles.text}>Ngày bắt đầu:</Text>
                <TouchableOpacity style={styles.dateContainer}>
                  <Text style={styles.textDate}>
                    {startDate.toLocaleDateString('en-GB')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateWrapper}>
                <Text style={styles.text}>Ngày kết thúc:</Text>
                <TouchableOpacity
                  onPress={() => setShowPicker(true)}
                  style={styles.dateContainer}>
                  <Text style={styles.textDate}>
                    {endDate.toLocaleDateString('en-GB')}
                  </Text>
                </TouchableOpacity>
                {showPicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                    positiveButton={{textColor: '#5EDFFF'}}
                    maximumDate={
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 2,
                        0,
                      )
                    }
                    minimumDate={new Date()}
                  />
                )}
              </View>
            </View>
          </View>

          <View style={styles.wrapper}>
            <Text style={styles.text}>Lí do:</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={value => setReason(value)}
              scrollEnabled
            />
          </View>

          <View style={styles.wrapper}>
            <View style={styles.button}>
              <Button
                title="Xem lại các form"
                onPress={() => openBottomSheet()}
              />
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>

          {renderBottomSheet()}
        </LinearGradient>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default FormScreen;
