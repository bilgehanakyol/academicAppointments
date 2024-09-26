import axios from 'axios';

export const addAvailability = async (day, timeSlots, academianId) => {
  try {
    const response = await axios.post('/availability', {
      day,
      slots: timeSlots,
      academian: academianId
    });
    return response.data;
  } catch (error) {
    console.error('An error occured:', error);
    throw error;
  }
};
