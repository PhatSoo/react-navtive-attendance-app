import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import {styles} from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {get_info} from '../../../api/users';
import {IEmployee} from '../../../types/interface';
import {Avatar, Text} from '@rneui/themed';

const HomeScreen = ({navigation}: any) => {
  const [userInfo, setUserInfo] = useState<IEmployee>();
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await get_info();
      if (res?.data.success) {
        setUserInfo(res.data.data);
        if (userInfo && userInfo.avatar) {
          setSelectedImage(userInfo.avatar);
        }
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <LinearGradient colors={['#ECFCFF', '#B2FCFF']} style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.infoText}>{userInfo?.name}</Text>
          <Text style={styles.positionText}>
            Chức vụ:{' '}
            <Text style={styles.infoText}> {userInfo?.role.typeName}</Text>
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Avatar
            size={120}
            rounded
            source={
              selectedImage
                ? {uri: selectedImage}
                : require('../../../assets/img/avatar.png')
            }
          />
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
        {userInfo?.isPartTime ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Schedule')}>
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
