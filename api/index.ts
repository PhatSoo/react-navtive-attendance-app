import axios from 'axios';
import {API} from '@env';

const apiManager = axios.create({
  baseURL: `${API}`,
});

export default apiManager;
