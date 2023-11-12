import apiManager from '.';

// type Shifts = {
//   shiftName: string;
//   startTime: number;
//   endTime: number;
// };

export const get_shift = async () => {
  try {
    return await apiManager.get('api/work-shift');
  } catch (error: any) {
    return error.response;
  }
};

export const get_current_shift = async () => {
  try {
    const res = await apiManager.get('api/current-shift');
    if (res.status === 200) {
      return res.data;
    }
  } catch (error: any) {
    console.log(error.response);
    // return error.response;
  }
};
