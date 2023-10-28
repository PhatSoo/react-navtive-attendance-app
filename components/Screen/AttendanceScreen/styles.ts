import {Dimensions, StyleSheet} from 'react-native';

const heightScreen = Dimensions.get('screen').height;

const styles = StyleSheet.create({
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
    padding: 10,
  },
  bottom: {
    flexGrow: 1,
    backgroundColor: 'green',
    padding: 10,
  },
  camera: {
    flexGrow: 1,
  },
  bound: ({width, height, x, y}) => {
    return {
      position: 'absolute',
      top: y,
      left: x,
      height,
      width,
      borderWidth: 5,
      borderColor: 'red',
      zIndex: 300,
    };
  },
});

export default styles;
