import mongoose, { model } from 'mongoose';
const {Schema} = mongoose;

const AvailabilitySchema = new Schema({
    date: String, // Müsait olunan tarih
    timeSlots: [String], // Müsait olunan zaman aralıkları (örneğin, ['09:00-10:00', '10:00-11:00'])
  });
  
  const UserSchema = new Schema ({
      name: String,
      email: {type: String, unique: true},
      password: String,
      role: { type: String, enum: ['student', 'academician'], required: true }, // Rol belirleme (öğrenci veya akademisyen)
      availability: [AvailabilitySchema], // Sadece akademisyenler için geçerli (randevu saatleri)
  });

const UserModel = model('User', UserSchema);

export default UserModel;
//TODO: QR