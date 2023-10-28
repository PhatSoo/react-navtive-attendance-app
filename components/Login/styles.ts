import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: 50,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  form: {
    marginHorizontal: 30,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginTop: 20,
    position: 'relative',
  },
  input: {
    borderColor: 'gray',
    fontSize: 20,
    width: '80%',
  },
  icon: {
    fontSize: 20,
    color: '#000',
    marginRight: 10,
  },
  rightIcon: {
    position: 'absolute',
    right: 0,
  },
  bottomText: {
    fontSize: 18,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  rowText: {
    fontSize: 16,
  },
  rowTextColored: {
    color: 'blue',
  },
  button: {
    backgroundColor: 'black',
    borderWidth: 5,
    borderColor: '#00B5E2',
    borderRadius: 30,
    width: 200,
    marginVertical: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 25,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  textDanger: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
