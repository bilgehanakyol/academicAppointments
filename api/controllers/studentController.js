import StudentModel from "../models/studentModel.js";

export const getStudent = async (req, res) => {
    try {
        const students = await StudentModel.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch students", error });
    }
}

export const searchStudent = async (req, res) => {
    const { studentNo } = req.query;

    try {
        const student = await StudentModel.findOne({ studentNo });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: "Failed to search for student", error });
    }
}