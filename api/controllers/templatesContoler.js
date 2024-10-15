import AppointmentRequestTemplateModel from "../models/AppointmentRequestTemplate.js";

export const templates = async (req, res) => {
    try {
        const templates = await AppointmentRequestTemplateModel.find();
        res.status(200).json({ success: true, templates });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch templates", error });
    }
}
export const addTemplate = async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ 
            success: false, 
            message: "Title and content are required."});
    }
    try {
        const newTemplate = new AppointmentRequestTemplateModel({ title, content });
        await newTemplate.save();
        res.status(200).json({ success: true, message: "Template added successfully." });
    } catch (error) {
        console.error("Error adding template:", error); 
        res.status(500).json({ success: false, message: "Server error, could not add template." });
    }
}