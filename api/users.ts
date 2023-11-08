import apiManager from '.';

type userLoginData = {
  email: string;
  password: string;
};

export const user_login = async (data: userLoginData) => {
  const response = await apiManager.post('/login', data);

  if (response.data.success) {
    apiManager.defaults.headers.common.Authorization = response.data.token;
  }

  return response;
};

export const get_info = async () => {
  return await apiManager.get('/me');
};

export const upload_avatar = async (data: any) => {
  const formData = new FormData();
  formData.append('avatar', {
    name: data.fileName,
    uri: data.uri,
    type: data.type,
  });

  const response = await apiManager.post('/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (response.status === 204) {
    return true;
  }
  return false;
};

export const upload_image = async (data: any) => {
  const formData = new FormData();
  formData.append('image', {
    name: data.fileName,
    uri: data.uri,
    type: data.type,
  });

  const response = await apiManager.post('/me/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (response.status === 204) {
    return true;
  }
  return false;
};

export const upload_info = async (data: any) => {
  try {
    return await apiManager.put('/me', data);
  } catch (error: any) {
    return error.response;
  }
};

export const get_schedule = async () => {
  try {
    const response = await apiManager.get('/me/schedule');
    return response.data.data;
  } catch (error: any) {
    return error.response;
  }
};

export const schedule_chosen = async (data: any) => {
  try {
    return await apiManager.post('/api/shift-schedule', data);
  } catch (error: any) {
    return error.response;
  }
};

export const get_attendance = async () => {
  try {
    return await apiManager.get('/me/attendance');
  } catch (error: any) {
    return error.response;
  }
};

export const attendance = async () => {
  try {
    return await apiManager.get('/me/image');
    // return;
  } catch (error: any) {
    return error.response;
  }
};
