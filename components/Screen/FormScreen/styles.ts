import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  wrapper: {
    marginVertical: 20,
  },
  dateGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateWrapper: {
    width: '40%',
  },
  dateContainer: {
    borderBottomWidth: 1,
    marginBottom: 10,
    width: '100%',
  },
  textDate: {
    paddingVertical: 10,
    fontSize: 25,
  },
  text: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#fff',
    fontSize: 20,
    borderRadius: 20,
    borderWidth: 1,
    height: 200,
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shift: {
    flexDirection: 'row',
  },
  switchButton: {
    marginLeft: 20,
  },
  submitButton: {
    backgroundColor: '#3E64FF',
    width: '80%',
    borderWidth: 3,
    borderRadius: 20,
  },
  submitText: {
    padding: 20,
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 20,
  },
  button: {
    alignItems: 'center',
  },
});
