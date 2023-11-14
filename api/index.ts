import axios from 'axios';
import {API, ATTENDANCE_PATH} from '@env';

console.log('====================================');
console.log(API, ATTENDANCE_PATH);
console.log('====================================');

const apiManager = axios.create({
  baseURL: `${API}`,
});

export default apiManager;
