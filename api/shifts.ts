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
