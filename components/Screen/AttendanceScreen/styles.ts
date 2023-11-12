import {Dimensions, StyleSheet} from 'react-native';

const heightScreen = Dimensions.get('screen').height;

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  top: {
    height: (heightScreen * 2) / 3,
    padding: 20,
  },
  bottom: {
    // flexGrow: 1,
    // padding: 10,
    // alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
  },
  camera: {
    flexGrow: 1,
  },
  anim: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#b3d9ff',
    borderRadius: 5,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d99', // Màu xanh đậm
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#008ae6', // Màu xanh dương
  },
  buttonText: {
    fontSize: 20,
    color: '#004080', // Màu xanh đậm nhấn
    textAlign: 'center',
    fontWeight: 'bold',
  },
  separator: {
    height: 1, // Khoảng cách mong muốn giữa các phần tử
    // width: 20,
    backgroundColor: '#000',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#008ae6',
    textAlign: 'center',
  },
});
