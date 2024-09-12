import axios from 'axios';

export const addAvailability = async (day, timeSlots, academianId) => {
  try {
    const response = await axios.post('/availability', {
      day,
      slots: timeSlots,  // slots dizisini string değil obje olarak gönderiyoruz
      academian: academianId
    });
    return response.data;
  } catch (error) {
    console.error('Müsaitlik eklenirken bir hata oluştu:', error);
    throw error;
  }
};
