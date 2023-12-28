import React from 'react';
import {ActivityIndicator, Modal, View, Text} from 'react-native';
import {styles} from './styles';

interface IProps {
  isLoading: boolean;
}

const Loading: React.FC<IProps> = ({isLoading}) => {
  return (
    <>
      <Modal visible={isLoading} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.textLoading}>Vui lòng đợi</Text>
        </View>
      </Modal>
    </>
  );
};

export default Loading;
