import React, {useMemo, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Keyboard,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {styles} from './styles';
import {RadioGroup} from 'react-native-radio-buttons-group';
import {useRoute} from '@react-navigation/native';

const FormScreen = () => {
  let startDate = new Date();
  if (useRoute().params) {
    startDate = new Date(useRoute().params.daySelected);
  }

  const [endDate, setEndDate] = useState(startDate);
  const [showPicker, setShowPicker] = useState(false);
  const [reason, setReason] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const radioButtons = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Ca sáng',
        value: 'morning',
        labelStyle: {
          color: 'red',
        },
        color: '#3E64FF',
      },
      {
        id: '2',
        label: 'Ca chiều',
        value: 'afternoon',
        labelStyle: {
          color: 'red',
        },
        color: '#3E64FF',
      },
    ],
    [],
  );

  const onChange = (event: any, selectedDate: any) => {
    setShowPicker(false);

    setEndDate(selectedDate);
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
            <View style={styles.shift}>
              <View style={styles.switch}>
                <Text style={styles.text}>Nghỉ cả ngày</Text>
                <Switch
                  style={styles.switchButton}
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
              <View>
                {!isEnabled && (
                  <RadioGroup
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    selectedId={selectedId}
                    layout="row"
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
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default FormScreen;
