import AcademianModel from "../models/AcademianModel.js";
import CalendarModel from "../models/CalendarModel.js";

export const getAcademians = async (req, res) => {
    try {
        const academians = await AcademianModel.find();
        res.status(200).json(academians);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const postAcademianAvailability = async (req, res) => {
    const { id } = req.params;
    const { availability } = req.body;
    try {
        let calendar = await CalendarModel.findOne({ academian: id });

        if (!calendar) {
            calendar = new CalendarModel({ academian: id, availability: [] });
        }

        const dayIndex = calendar.availability.findIndex(d => d.day === availability.day);
        if (dayIndex > -1) {
            calendar.availability[dayIndex].slots.push(...availability.slots);
        } else {
            calendar.availability.push(availability);
        }

        await calendar.save();
        res.status(200).json({ message: 'Availability updated successfully', calendar });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getAcademianAvailability = async (req, res) => {
    const { academianId } = req.params;

    try {
        const calendar = await CalendarModel.findOne({ academian: academianId });
        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }
        res.status(200).json(calendar.availability);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const deleteSlot = async (req, res) => {
    const { academianId, slotId } = req.params;

    try {
        const calendar = await CalendarModel.findOne({ academian: academianId });
        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }
        let found = false;
        calendar.availability.forEach(day => {
            day.slots = day.slots.filter(slot => {
                const isSlotDeleted = slot._id.toString() === slotId;
                if (isSlotDeleted) found = true;
                return !isSlotDeleted;
            });
        });
        if (!found) {
            return res.status(404).json({ message: 'Slot not found' });
        }
        await calendar.save();
        res.status(200).json({ message: 'Slot deleted successfully', calendar });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getCalendar = async (req, res) => {
    const { academianId } = req.params;
    try {
        const calendar = await CalendarModel.findOne({ academian: academianId }).populate('academian');
        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }
        res.status(200).json(calendar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching calendar' });
    }
}