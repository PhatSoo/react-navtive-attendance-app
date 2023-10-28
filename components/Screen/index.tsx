import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import CalendarScreen from './CalendarScreen';
import SettingScreen from './SettingScreen';
import FormScreen from './FormScreen';
import Attendance from './AttendanceScreen';

const Stack = createNativeStackNavigator();

const Screen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Attendance" component={Attendance} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Form" component={FormScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
    </Stack.Navigator>
  );
};

export default Screen;
