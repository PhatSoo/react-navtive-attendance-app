import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingBottom: 10,
  },
  header: {
    // backgroundColor: '#ECFCFF',
    height: '20%',
    width: '100%',
  },
  image: {
    marginTop: -60,
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#000',
  },
  editButton: {
    alignItems: 'flex-end',
    top: -20,
  },
  contentContainer: {
    width: '100%',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupInfo: {
    width: '100%',
    // paddingHorizontal: 20,
    paddingVertical: 20,
  },
  groupRow: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
  },
  groupChild: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  passButton: {
    backgroundColor: '#3E64FF',
    width: '80%',
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modal: {
    backgroundColor: '#5EDFFF',
    width: '80%',
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#000',
  },
  modalInput: {
    backgroundColor: '#eee',
    marginVertical: 10,
    padding: 10,
    borderRadius: 20,
    borderColor: '#000',
    borderWidth: 1,
    fontSize: 18,
  },
  modalButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#0099FF',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#000',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#000',
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  input: {
    backgroundColor: '#eee',
    width: '55%',
    fontSize: 15,
    marginLeft: 10,
  },
  imageButton: {
    backgroundColor: 'red',
    width: '80%',
    padding: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
});
