import axios from 'axios';
import {API, API2} from '@env';

console.log('====================================');
console.log('aloa', API, API2);
console.log('====================================');

export const apiManager = axios.create({
  baseURL: `${API}`,
});

export const apiManager2 = axios.create({
  baseURL: `${API2}`,
});
