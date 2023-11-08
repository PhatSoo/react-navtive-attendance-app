import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFCFF',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  noteGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 20,
  },
  square: {
    width: 20,
    height: 20,
    borderRadius: 100,
    marginRight: 10,
  },
  note: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#3E64FF',
    padding: 10,
    borderRadius: 30,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
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
    justifyContent: 'space-around',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  modalContent: {
    height: '70%',
  },
  modalGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalLabel: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  separate: {
    height: 2,
    backgroundColor: '#aaa',
    marginVertical: 10,
  },
});
