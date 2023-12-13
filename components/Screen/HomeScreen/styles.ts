import {Dimensions, StyleSheet} from 'react-native';

const windowHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#00B5E2',
  },
  infoContainer: {
    paddingTop: 2,
    height: windowHeight / 4,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    // backgroundColor: '#F2FCFC',
  },
  textContainer: {
    flex: 1,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 25,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  positionText: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  imageContainer: {
    width: 120, // Điều chỉnh kích thước tùy theo nhu cầu của bạn
    height: 120, // Điều chỉnh kích thước tùy theo nhu cầu của bạn
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  buttonContainer: {
    height: (windowHeight / 4) * 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    // backgroundColor: '#BDF1F6',
  },
  button: {
    backgroundColor: '#5EDFFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    width: '45%',
    height: '38%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 8,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#000',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#3E64FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    width: '80%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logoutButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    marginLeft: 10,
  },
});
