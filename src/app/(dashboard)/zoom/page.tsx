"use client";
import React, { useState } from "react";
import MeetingDialog from "@/components/dashboard/zoom/form-modal";

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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const generateZoomLink = () =>
        `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const handleAddMeeting = (form: { title: string; date: string; time: string; recipients: string[] }) => {
        const newMeeting: Meeting = {
            id: Date.now(),
            title: form.title,
            date: form.date,
            time: form.time,
            recipients: form.recipients,
            zoomLink: generateZoomLink(),
        };

        setMeetings([...meetings, newMeeting]);
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
                {/* Use the Dialog Component */}
                <MeetingDialog
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddMeeting}
                />

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
