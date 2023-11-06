import {Dimensions, StyleSheet} from 'react-native';

const heightScreen = Dimensions.get('screen').height;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  flatListContainer: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    maxHeight: heightScreen * 0.45,
  },
  dayButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#000',
    marginLeft: 5,
  },
  shiftContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
  },
  shiftButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#BDF1F6',
    borderRadius: 5,
  },
  confirmButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F2FCFC',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#fff',
    width: '80%',
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
    color: '#000',
  },
  closeButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E64FF',
  },
  separator: {
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderColor: '#000',
    borderWidth: 2,
  },
  modalConfirm: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
});
