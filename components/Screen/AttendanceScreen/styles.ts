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
    flexGrow: 1,
    // backgroundColor: 'green',
    padding: 10,
    alignItems: 'center',
  },
  camera: {
    flexGrow: 1,
  },
  anim: {
    width: 50,
    height: 50,
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    marginTop: 50,
    padding: 20,
    backgroundColor: '#3E64FF',
    borderRadius: 20,
    width: '40%',
  },
});
