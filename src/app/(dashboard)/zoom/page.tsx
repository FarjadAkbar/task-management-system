"use client";
import React, { useState } from "react";

type Meeting = {
    id: number;
    title: string;
    date: string;
    time: string;
    recipients: string[];
    zoomLink: string;
};

const App: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [form, setForm] = useState({
        title: "",
        date: "",
        time: "",
        recipients: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const generateZoomLink = () =>
        `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleRecipientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions, (option) => option.value);
        setForm({ ...form, recipients: options });
    };
    const handleAddMeeting = () => {
        if (!form.title || !form.date || !form.time || !form.recipients) {
            alert("Please fill out all fields!");
            return;
        }

        const newMeeting: Meeting = {
            id: Date.now(),
            title: form.title,
            date: form.date,
            time: form.time,
            recipients: form.recipients.split(",").map((email) => email.trim()),
            zoomLink: generateZoomLink(),
        };

        setMeetings([...meetings, newMeeting]);
        setForm({ title: "", date: "", time: "", recipients: "" });
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center p-6 bg-white shadow-lg rounded-md mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Meeting Management</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black font-semibold text-gold py-2 px-6 rounded-lg shadow-lg hover:bg-gold hover:text-black transition-all"
                    >
                        + Add Meeting
                    </button>
                </header>

                {/* Modal for Scheduling a Meeting */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Schedule a New Meeting</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-black mb-2">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                        placeholder="Enter meeting title"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-black mb-2">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-black mb-2">Time</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={form.time}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-black mb-2">Recipients</label>
                                    <select
                                        name="recipients"
                                        value={form.recipients}
                                        onChange={handleRecipientChange}
                                        className="w-full border border-gray-700 rounded-lg p-2"
                                    >
                                        <option value="">Select Please</option>
                                        <option value="Web Developers">Web Developers</option>
                                        <option value="Web Designers">Web Designers</option>
                                        <option value="SEO Content Writers">SEO Content Writers</option>
                                        <option value="SEO Specialist">SEO Specialist</option>
                                    </select>
                                </div>
                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        onClick={handleAddMeeting}
                                        className="bg-black font-semibold text-gold py-2 px-6 rounded-lg shadow-lg hover:bg-gold hover:text-black transition-all"
                                    >
                                        Add Meeting
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)} // Close the modal
                                        className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-gray-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Meetings List */}
                <div className="bg-white p-8 shadow-lg rounded-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Scheduled Meetings</h2>
                    <table className="min-w-full bg-white shadow-md rounded-md">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="py-3 px-4 text-lg font-medium text-black">Title</th>
                                <th className="py-3 px-4 text-lg font-medium text-black">Date</th>
                                <th className="py-3 px-4 text-lg font-medium text-black">Time</th>
                                <th className="py-3 px-4 text-lg font-medium text-black">Recipients</th>
                                <th className="py-3 px-4 text-lg font-medium text-black">Zoom Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-600">
                                        No meetings scheduled yet.
                                    </td>
                                </tr>
                            ) : (
                                meetings.map((meeting) => (
                                    <tr key={meeting.id} className="border-b hover:bg-gray-50">
                                        <td className="py-4 px-6">{meeting.title}</td>
                                        <td className="py-4 px-6">{meeting.date}</td>
                                        <td className="py-4 px-6">{meeting.time}</td>
                                        <td className="py-4 px-6">{meeting.recipients.join(", ")}</td>
                                        <td className="py-4 px-6 text-blue-600 underline">
                                            <a href={meeting.zoomLink} target="_blank" rel="noopener noreferrer">
                                                Join
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default App;
