import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

import {styles} from './styles';
import {get_info, upload_info} from '../../../api/users';
import {Input, ListItem, Image} from '@rneui/themed';

type UserInfo = {
  name: string;
  email: string;
  role: {
    typeName: string;
  };
  CCCD: number;
  phone: string;
  isPartTime: Boolean;
  sex: Boolean;
  avatar: string;
  image: string;
};

const SettingScreen = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [conformPassword, setConformPassword] = useState('');
  const [editPhoneOpen, setEditPhoneOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [phone, setPhone] = useState('');

  // Get user login info
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
  }, [userInfo /*, isUpdated*/]);

  const handleEditPhone = () => {
    if (userInfo) {
      setEditPhoneOpen(true);
      setPhone(userInfo?.phone);
    }
  };

  const handleUpdatePhone = async () => {
    if (phone.length < 10) {
      Alert.alert('Thông báo', 'Hãy nhập SDT 10 số!');
      return;
    }
    const data = {phone};
    await upload_info(data);
    setEditPhoneOpen(false);
  };

  const handleUpdatePassword = async () => {
    if (oldPassword === '' || newPassword === '' || conformPassword === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ các trường!');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Thông báo', 'Mật khẩu phải có ít nhất 8 ký tự!');
      return;
    }

    if (newPassword !== conformPassword) {
      Alert.alert('Thông báo', 'Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    if (oldPassword === newPassword) {
      Alert.alert('Thông báo', 'Hãy nhập mật khẩu mới khác với mật khẩu cũ!');
      return;
    }

    const data = {oldPassword, newPassword};
    const response = await upload_info(data);

    if (response.data.success === false) {
      Alert.alert('Thông báo', response?.data.message);
      return;
    }
    Alert.alert('Thành công', 'Cập nhật Password thành công.');
    setModalOpen(false);
    setOldPassword('');
    setNewPassword('');
    setConformPassword('');
  };

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('../../../assets/img/logo-white.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode="repeat"
            />
          </View>
          {/* <View style={styles.header} /> */}

          <View style={styles.image}>
            <Image
              source={
                selectedImage
                  ? {uri: selectedImage}
                  : require('../../../assets/img/avatar.png')
              }
              style={styles.avatar}
            />
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.groupInfo}>
              <ListItem bottomDivider>
                <Icon name="envelope" size={20} color={'#000'} />
                <ListItem.Content>
                  <ListItem.Title>Email:</ListItem.Title>
                  <ListItem.Subtitle>{userInfo?.email}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>

              <ListItem bottomDivider>
                <Icon name="user" size={20} color={'#000'} />
                <ListItem.Content>
                  <ListItem.Title>Tên:</ListItem.Title>
                  <ListItem.Subtitle>{userInfo?.name}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>

              <ListItem bottomDivider>
                <Icon name="briefcase" size={20} color={'#000'} />
                <ListItem.Content>
                  <ListItem.Title>Chức vụ:</ListItem.Title>
                  <ListItem.Subtitle>
                    {userInfo?.role.typeName}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>

              <ListItem bottomDivider>
                <Icon name="id-card" size={20} color={'#000'} />
                <ListItem.Content>
                  <ListItem.Title>CCCD:</ListItem.Title>
                  <ListItem.Subtitle>{userInfo?.CCCD}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>

              {!editPhoneOpen ? (
                <ListItem bottomDivider>
                  <Icon name="phone" size={20} color={'#000'} />
                  <ListItem.Content>
                    <ListItem.Title>Phone:</ListItem.Title>
                    <ListItem.Subtitle>{userInfo?.phone}</ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron onPress={handleEditPhone} />
                </ListItem>
              ) : (
                <ListItem bottomDivider>
                  <Icon name="phone" size={20} color={'#000'} />
                  <ListItem.Content>
                    <ListItem.Title>Phone:</ListItem.Title>
                    <Input
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="numeric"
                      placeholder="Hãy nhập SDT 10 số"
                      maxLength={10}
                    />
                  </ListItem.Content>
                  <Icon
                    name="check"
                    size={20}
                    color={'#000'}
                    onPress={handleUpdatePhone}
                  />
                  <Icon
                    name="close"
                    size={20}
                    color={'#000'}
                    onPress={() => setEditPhoneOpen(false)}
                  />
                </ListItem>
              )}
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.passButton}
                onPress={() => {
                  setModalOpen(true);
                  setOldPassword('');
                  setNewPassword('');
                  setConformPassword('');
                }}>
                <Text style={styles.buttonText}>Đổi mật khẩu</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalOpen(false)}
            visible={modalOpen}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContainer}>
                <View style={styles.modal}>
                  <Text style={styles.modalTitle}>Thay đổi mật khẩu</Text>
                  <View>
                    <TextInput
                      placeholder="Mật khẩu cũ"
                      value={oldPassword}
                      onChangeText={setOldPassword}
                      style={styles.modalInput}
                      secureTextEntry
                    />
                    <TextInput
                      placeholder="Mật khẩu mới"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      style={styles.modalInput}
                      secureTextEntry
                    />
                    <TextInput
                      placeholder="Xác nhận mật khẩu"
                      value={conformPassword}
                      onChangeText={setConformPassword}
                      style={styles.modalInput}
                      secureTextEntry
                    />
                  </View>
                  <View style={styles.modalButton}>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleUpdatePassword}>
                      <Text style={styles.modalText}>Lưu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setModalOpen(false)}>
                      <Text style={styles.modalText}>Hủy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SettingScreen;
