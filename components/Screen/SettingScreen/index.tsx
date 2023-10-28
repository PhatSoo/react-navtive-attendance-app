import React, {useState} from 'react';
import {
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

import styles from './styles';

const SettingScreen = () => {
  const userInfo = {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    role: 'nhân viên văn phòng',
    cccd: '012345678901',
    phone: '0123456789',
    isPartTime: 1,
    sex: 1,
    image:
      'file:///data/user/0/com.mobile/cache/rn_image_picker_lib_temp_b6186c4a-9838-4dce-a12f-02da0033efe0.jpg',
  };

  const [selectedImage, setSelectedImage] = useState(userInfo.image);
  const [modalOpen, setModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editPhoneOpen, setEditPhoneOpen] = useState(false);
  const [phone, setPhone] = useState(userInfo.phone);

  const getAvatar = async () => {
    await launchImageLibrary({mediaType: 'photo'}, res => {
      if (res.didCancel) {
        return;
      }
      if (res.errorCode) {
        console.log('====================================');
        console.log(res.errorMessage);
        console.log('====================================');
        return;
      }
      return setSelectedImage(res.assets[0].uri);
    });
  };

  const handleEditPhone = () => {
    setEditPhoneOpen(false);
  };

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header} />

          <View style={styles.image}>
            <Image source={{uri: selectedImage}} style={styles.avatar} />
            <TouchableOpacity onPress={getAvatar} style={styles.editButton}>
              <Icon name="pencil" size={20} color={'#000'} />
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.groupInfo}>
              <View style={styles.groupRow}>
                <Icon name="envelope" size={20} color={'#000'} />
                <Text style={styles.label}> Email:</Text>
                <Text style={styles.text}>{userInfo.email}</Text>
              </View>
              <View style={styles.groupRow}>
                <Icon name="user" size={20} color={'#000'} />
                <Text style={styles.label}> Tên:</Text>
                <Text style={styles.text}>{userInfo.name}</Text>
              </View>

              <View style={styles.groupRow}>
                <Icon name="briefcase" size={20} color={'#000'} />
                <Text style={styles.label}> Chức vụ:</Text>
                <Text style={styles.text}>{userInfo.role}</Text>
              </View>

              <View style={styles.groupRow}>
                <Icon name="id-card" size={20} color={'#000'} />
                <Text style={styles.label}> CCCD:</Text>
                <Text style={styles.text}>{userInfo.cccd}</Text>
              </View>

              {!editPhoneOpen ? (
                <View
                  style={[styles.groupRow, {justifyContent: 'space-between'}]}>
                  <View style={styles.groupChild}>
                    <Icon name="phone" size={20} color={'#000'} />
                    <Text style={styles.label}> Phone:</Text>
                    <Text style={styles.text}>{userInfo.phone}</Text>
                  </View>

                  <View style={styles.groupChild}>
                    <TouchableOpacity onPress={() => setEditPhoneOpen(true)}>
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
                    />
                  </View>

                  <View style={styles.groupChild}>
                    <TouchableOpacity onPress={handleEditPhone}>
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
                  <Text style={styles.text}>{userInfo.sex ? 'Nam' : 'Nữ'}</Text>
                </View>
                <View style={[styles.groupChild, {marginLeft: 40}]}>
                  <Icon name="clock-o" size={20} color={'#000'} />
                  <Text style={styles.text}>
                    {userInfo.isPartTime ? 'Part Time' : 'Full Time'}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.passButton}
              onPress={() => setModalOpen(true)}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                Đổi mật khẩu
              </Text>
            </TouchableOpacity>
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
                    />
                    <TextInput
                      placeholder="Mật khẩu mới"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      style={styles.modalInput}
                    />
                    <TextInput
                      placeholder="Xác nhận mật khẩu"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      style={styles.modalInput}
                    />
                  </View>
                  <View style={styles.modalButton}>
                    <TouchableOpacity style={styles.submitButton}>
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
