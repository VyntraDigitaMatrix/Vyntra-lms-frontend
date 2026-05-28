import React, { useState } from "react";
import { FaHeadset, FaTimes, FaPaperPlane } from "react-icons/fa";

function ContactSupport() {
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState("");

  const courses = [
    "React JS",
    "JavaScript",
    "UI/UX Design",
    "Python",
    "Full Stack Development",
  ];

  const [chats, setChats] = useState([
    {
      sender: "bot",
      text: "Hi! Ask me about courses. If you are confused, I can suggest course options.",
    },
  ]);

  const getBotReply = (userText) => {
    const text = userText.toLowerCase();

    if (
      text.includes("confused") ||
      text.includes("which course") ||
      text.includes("select") ||
      text.includes("choose")
    ) {
      return {
        text: "No problem. Please select a course from the dropdown below.",
        showCourses: true,
      };
    }

    if (text.includes("react")) {
      return { text: "React JS is best for building modern frontend websites and dashboards." };
    }

    if (text.includes("javascript")) {
      return { text: "JavaScript is the basic language you should learn before React." };
    }

    if (text.includes("ui") || text.includes("ux")) {
      return { text: "UI/UX Design helps you learn layouts, colors, wireframes, and user-friendly screens." };
    }

    if (text.includes("python")) {
      return { text: "Python is good for backend, automation, AI, and data-related projects." };
    }

    if (text.includes("full stack")) {
      return { text: "Full Stack Development teaches frontend, backend, database, and deployment." };
    }

    return {
      text: "I can help with React JS, JavaScript, UI/UX Design, Python, and Full Stack Development.",
    };
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    const botMsg = { sender: "bot", ...getBotReply(message) };

    setChats((prev) => [...prev, userMsg, botMsg]);
    setMessage("");
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);

    setChats((prev) => [
      ...prev,
      {
        sender: "user",
        text: course,
      },
      {
        sender: "bot",
        text:
          course === "React JS"
            ? "React JS is a great choice if you want to build web apps, dashboards, and LMS interfaces."
            : course === "JavaScript"
            ? "JavaScript is the foundation for frontend development. Start here if you are new."
            : course === "UI/UX Design"
            ? "UI/UX Design is best if you like designing screens, layouts, and user experiences."
            : course === "Python"
            ? "Python is best for backend, automation, AI basics, and data projects."
            : "Full Stack Development is best if you want to learn complete web development from frontend to backend.",
      },
    ]);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden scrollbar-hide">
          {/* Header */}
          <div className="h-14 bg-blue-600 text-white flex items-center justify-between px-4">
            <div>
              <h3 className="font-semibold">AI Course Support</h3>
              <p className="text-xs text-orange-100">Online now</p>
            </div>

            <button onClick={() => setOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* Chat Body */}
          <div className="h-[360px] p-4 overflow-y-auto scrollbar-hide bg-text-[#976bff] space-y-3">
            {chats.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2 rounded-2xl text-sm leading-6 ${
                    chat.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white text-blue-600 border border-gray-200 rounded-bl-sm"
                  }`}
                >
                  <p>{chat.text}</p>

                  {chat.showCourses && (
                    <select
                      value={selectedCourse}
                      onChange={(e) => handleCourseSelect(e.target.value)}
                      className="mt-3 w-full h-10 border border-orange-200 rounded-lg px-3 text-gray-700 outline-none focus:ring-0 focus:border-orange-400 bg-orange-50"
                    >
                      <option value="">Select course</option>
                      {courses.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="h-[76px] border-t border-gray-200 p-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about courses..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 h-11 border border-gray-200 rounded-xl px-4 outline-none focus:border-blue-500 text-sm"
            />

            <button
              onClick={sendMessage}
              className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-500 transition"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-500 transition z-50"
      >
        <FaHeadset />
      </button>
    </>
  );
}

export default ContactSupport;