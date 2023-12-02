import apiManager from '.';

type userLoginData = {
  email: string;
  password: string;
};

export const user_login = async (data: userLoginData) => {
  try {
    const response = await apiManager.post('/login', data);

    if (response.data.success) {
      apiManager.defaults.headers.common.Authorization = response.data.token;
    }

    return response;
  } catch (error: any) {
    console.error('Full error object:', error);
    console.error('Error as JSON:', JSON.stringify(error, null, 2));
  }
};

export const get_info = async () => {
  return await apiManager.get('/me');
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
  } catch (error: any) {
    return error.response;
  }
};

export const get_existing_shift = async (shiftId: string) => {
  try {
    const res = await apiManager.get(`me/existing-shift/${shiftId}`);
    return res.data;
  } catch (error: any) {
    return error.response.data.message;
  }
};

export const check = async (formData: any) => {
  try {
    return await apiManager.put('me/check', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error: any) {
    console.log(error);
  }
};
