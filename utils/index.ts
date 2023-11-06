import {JWT_PASS} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from 'react-native-pure-jwt';

export const getDateOfFirstDayOfNextMonth = (date: Date) => {
  const nextMonth = date.getMonth() + 2;
  const daysInMonth = new Date(date.getFullYear(), nextMonth).getDate();
  return new Date(date.getFullYear(), nextMonth, daysInMonth);
};

export const isTokenExpired = (token: string) => {
  return decode(token, JWT_PASS)
    .then(() => {
      return false;
    })
    .catch(() => {
      return true;
    });
};

export const clearToken = async () => {
  await AsyncStorage.clear();
};

export const getCurrentUserId = (token: string) => {
  return decode(token, JWT_PASS).then(result => {
    return result.payload.id;
  });
};
