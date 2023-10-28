import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = ({navigation}: any) => {
  const employeeInfo = {
    name: 'Nguyễn Văn A',
    position: 'Nhân viên văn phòng',
    isPartTime: false,
    image: require('../../../assets/img/avatar.png'),
  };

  return (
    <LinearGradient colors={['#ECFCFF', '#B2FCFF']} style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.infoText}>{employeeInfo.name}</Text>
          <Text style={styles.positionText}>
            Chức vụ:{' '}
            <Text style={styles.infoText}> {employeeInfo.position}</Text>
          </Text>
        </View>
        <View>
          <Image source={employeeInfo.image} style={styles.avatar} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Attendance')}>
          <Icon name="clock-o" size={30} color="#000" />
          <Text style={styles.buttonText}>Chấm công</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Calendar')}>
          <Icon name="calendar" size={30} color="#000" />
          <Text style={styles.buttonText}>Xem lịch</Text>
        </TouchableOpacity>
        {employeeInfo.isPartTime ? (
          <TouchableOpacity style={styles.button}>
            <Icon name="edit" size={30} color="#000" />
            <Text style={styles.buttonText}>Chọn ca làm</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Form')}>
            <Icon name="edit" size={30} color="#000" />
            <Text style={styles.buttonText}>Đơn xin nghỉ</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Setting')}>
          <Icon name="cog" size={30} color="#000" />
          <Text style={styles.buttonText}>Thông tin nhân viên</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.replace('Login')}>
          <Icon name="sign-out" size={30} color="#FFF" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;
