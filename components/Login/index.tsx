import React, {useEffect, useState} from 'react';
import {API, PORT} from '@env';
import {
  BackHandler,
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const Login = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [checkEmail, isCheckEmail] = useState({status: true, error: ''});
  const [checkPass, isCheckPass] = useState({status: true, error: ''});
  const [exitApp, setExitApp] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (exitApp) {
        // Thoát ứng dụng
        BackHandler.exitApp();
      } else {
        setExitApp(true);
        ToastAndroid.show('Nhấn lần nữa để thoát', ToastAndroid.SHORT);

        // Đặt lại trạng thái sau một khoảng thời gian
        setTimeout(() => {
          setExitApp(false);
        }, 2000); // 2 giây

        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [exitApp]);

  const handleLogin = async () => {
    let formData = {
      email,
      password,
    };

    let isEmailValid = true;
    let isPasswordValid = true;

    if (!formData.email) {
      isCheckEmail({
        status: false,
        error: 'Vui lòng nhập email',
      });
      isEmailValid = false;
    } else {
      let regexEmail = new RegExp(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      );

      if (!regexEmail.test(formData.email)) {
        isCheckEmail({
          status: false,
          error: 'Email không hợp lệ',
        });
        isEmailValid = false;
      } else {
        isCheckEmail({
          status: true,
          error: '',
        });
      }
    }

    if (!formData.password) {
      isCheckPass({
        status: false,
        error: 'Vui lòng nhập mật khẩu',
      });
      isPasswordValid = false;
    } else if (formData.password.length < 8) {
      isCheckPass({
        status: false,
        error: 'Mật khẩu phải có ít nhất 8 ký tự',
      });
      isPasswordValid = false;
    } else {
      isCheckPass({
        status: true,
        error: '',
      });
    }

    if (isEmailValid && isPasswordValid) {
      try {
        await axios
          .post(`${API}:${PORT}/api/login/`, formData)
          .then(() => navigation.navigate('Screen'));
      } catch (error: any) {
        console.error(error.response.data.message);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
        <View style={styles.header}>
          <Image
            source={require('../../assets/img/logo-white.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>sign in</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.group}>
            <Icon name="user-o" style={styles.icon} />
            <TextInput
              placeholder="Email"
              style={styles.input}
              onChangeText={value => setEmail(value)}
              value={email}
            />
          </View>
          {!checkEmail.status ? (
            <Text style={styles.textDanger}>{checkEmail.error}</Text>
          ) : (
            ''
          )}

          <View style={styles.group}>
            <Icon name="unlock-alt" style={styles.icon} />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry={hidePassword}
              value={password}
              onChangeText={value => setPassword(value)}
            />
            <Icon
              name={hidePassword ? 'eye-slash' : 'eye'}
              style={[styles.icon, styles.rightIcon]}
              onPress={() => setHidePassword(!hidePassword)}
            />
          </View>
          {!checkPass.status ? (
            <Text style={styles.textDanger}>{checkPass.error}</Text>
          ) : (
            ''
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.rowText}>Don't have an account? </Text>
          <Text style={[styles.rowText, styles.rowTextColored]}>
            Contact the Admin!
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
