import React, {useEffect, useState} from 'react';
import {API, AVATAR_PATH, ATTENDANCE_PATH} from '@env';
import {
  Alert,
  Image,
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
import {launchImageLibrary} from 'react-native-image-picker';

import {styles} from './styles';
import {
  get_info,
  upload_avatar,
  upload_image,
  upload_info,
} from '../../../api/users';

type UserInfo = {
  name: string;
  email: string;
  roleId: {
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
  const [isUpdated, setIsUpdated] = useState(0);
  const [imageModal, setImageModal] = useState(false);
  const [imageLink, setImageLink] = useState('');

  // Get user login info
  useEffect(() => {
    const fetchData = async () => {
      const res = await get_info();
      if (res?.data.success) {
        setUserInfo(res.data.data);
        if (userInfo && userInfo.avatar) {
          const avatarPath = API + '/' + AVATAR_PATH + '/' + userInfo.avatar;
          setSelectedImage(avatarPath);
        }
        if (userInfo && userInfo.image) {
          const imagePath = API + '/' + ATTENDANCE_PATH + '/' + userInfo.image;
          setImageLink(imagePath);
        }
      }
    };
    fetchData();
  }, [userInfo, isUpdated]);

  const getAvatar = async (store: string) => {
    await launchImageLibrary({mediaType: 'photo'}, async res => {
      if (res.didCancel) {
        return;
      }
      if (res.errorCode) {
        console.log('====================================');
        console.log(res.errorMessage);
        console.log('====================================');
        return;
      }
      if (res.assets) {
        if (store === 'avatar') {
          const result = await upload_avatar(res.assets[0]);
          if (result) {
            setIsUpdated(isUpdated + 1);
          }
        } else if (store === 'image') {
          const result = await upload_image(res.assets[0]);
          if (result) {
            Alert.alert(
              'Thông báo',
              'Bạn đã cập nhận ảnh chấm công thành công!',
            );
            setIsUpdated(isUpdated + 1);
          }
        }
      }
    });
  };

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
      console.log('====================================');
      console.log(response.data.success);
      console.log('====================================');
      Alert.alert('Thông báo', response?.data.message);
      return;
    }
    Alert.alert('Thành công', 'Cập nhật Password thành công.');
    setModalOpen(false);
    setOldPassword('');
    setNewPassword('');
    setConformPassword('');
  };

  const renderImageModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        onRequestClose={() => setImageModal(false)}
        visible={imageModal}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Thay đổi mật khẩu</Text>
              <View
                style={{
                  minHeight: 200,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                }}>
                {!imageLink ? (
                  <Text style={styles.text}>
                    Bạn chưa chọn ảnh để chấm công
                  </Text>
                ) : (
                  <Image
                    source={{uri: imageLink}}
                    width={300}
                    height={300}
                    borderRadius={20}
                  />
                )}
              </View>
              <View style={styles.modalButton}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => getAvatar('image')}>
                  <Text style={styles.modalText}>Chọn ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setImageModal(false)}>
                  <Text style={styles.modalText}>Trở về</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header} />

          <View style={styles.image}>
            <Image
              source={
                selectedImage
                  ? {uri: selectedImage}
                  : require('../../../assets/img/avatar.png')
              }
              style={styles.avatar}
            />
            <TouchableOpacity
              onPress={() => getAvatar('avatar')}
              style={styles.editButton}>
              <Icon name="pencil" size={20} color={'#000'} />
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.groupInfo}>
              <View style={styles.groupRow}>
                <Icon name="envelope" size={20} color={'#000'} />
                <Text style={styles.label}> Email:</Text>
                <Text style={styles.text}>{userInfo?.email}</Text>
              </View>
              <View style={styles.groupRow}>
                <Icon name="user" size={20} color={'#000'} />
                <Text style={styles.label}> Tên:</Text>
                <Text style={styles.text}>{userInfo?.name}</Text>
              </View>

              <View style={styles.groupRow}>
                <Icon name="briefcase" size={20} color={'#000'} />
                <Text style={styles.label}> Chức vụ:</Text>
                <Text style={styles.text}>{userInfo?.roleId.typeName}</Text>
              </View>

              <View style={styles.groupRow}>
                <Icon name="id-card" size={20} color={'#000'} />
                <Text style={styles.label}> CCCD:</Text>
                <Text style={styles.text}>{userInfo?.CCCD}</Text>
              </View>

              {!editPhoneOpen ? (
                <View
                  style={[styles.groupRow, {justifyContent: 'space-between'}]}>
                  <View style={styles.groupChild}>
                    <Icon name="phone" size={20} color={'#000'} />
                    <Text style={styles.label}> Phone:</Text>
                    <Text style={styles.text}>{userInfo?.phone}</Text>
                  </View>

                  <View style={styles.groupChild}>
                    <TouchableOpacity onPress={handleEditPhone}>
                      <Icon name="edit" size={20} color={'#000'} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View
                  style={[styles.groupRow, {justifyContent: 'space-between'}]}>
                  <View style={styles.groupChild}>
                    <Icon name="phone" size={20} color={'#000'} />
                    <Text style={styles.label}> Phone:</Text>
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      style={styles.input}
                      keyboardType="numeric"
                      placeholder="Hãy nhập SDT 10 số"
                      maxLength={10}
                    />
                  </View>

                  <View style={styles.groupChild}>
                    <TouchableOpacity onPress={handleUpdatePhone}>
                      <Icon name="check" size={20} color={'#000'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setEditPhoneOpen(false)}
                      style={{marginLeft: 20}}>
                      <Icon name="close" size={20} color={'#000'} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.groupRow}>
                <View style={styles.groupChild}>
                  <Icon name="venus-mars" size={20} color={'#000'} />
                  <Text style={styles.label}> Giới tính:</Text>
                  <Text style={styles.text}>
                    {userInfo?.sex ? 'Nam' : 'Nữ'}
                  </Text>
                </View>
                <View style={[styles.groupChild, {marginLeft: 40}]}>
                  <Icon name="clock-o" size={20} color={'#000'} />
                  <Text style={styles.text}>
                    {userInfo?.isPartTime ? 'Part Time' : 'Full Time'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.imageButton}
                onPress={() => setImageModal(true)}>
                <Text style={styles.buttonText}>Ảnh chấm công</Text>
              </TouchableOpacity>

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

          {renderImageModal()}
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
