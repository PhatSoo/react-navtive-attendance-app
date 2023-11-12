import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {clearToken, isTokenExpired} from '../../utils';

import ShiftInformation from '../Infomations/ShiftInformation';
import HomeScreen from './HomeScreen';
import CalendarScreen from './CalendarScreen';
import SettingScreen from './SettingScreen';
import FormScreen from './FormScreen';
import Attendance from './AttendanceScreen';
import ScheduleScreen from './ScheduleScreen';

const Stack = createNativeStackNavigator();

const Screen = ({navigation}: any) => {
  useEffect(() => {
    handleGetToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetToken = async () => {
    const state = navigation.getState();
    let currentRoute = state.routes[state.index].name; // Get the current route name
    if (currentRoute !== 'Login') {
      const dataToken = await AsyncStorage.getItem('AccessToken');
      if (!dataToken || (await isTokenExpired(dataToken))) {
        Alert.alert(
          'Thông báo',
          'Phiên đăng nhập hết hạn\nVui lòng đăng nhập lại!',
          [
            {
              text: 'OK',
              onPress: async () => {
                await clearToken();
                navigation.replace('Login');
              },
            },
          ],
        );
      }
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerTitleAlign: 'center'}}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        options={{headerTitle: 'Chấm công'}}
        name="Attendance"
        component={Attendance}
      />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Form" component={FormScreen} />
      <Stack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{headerRight: ShiftInformation}}
      />
      <Stack.Screen name="Setting" component={SettingScreen} />
    </Stack.Navigator>
  );
};

export default Screen;
