import React, { useState } from "react";
const API_URL = process.env.REACT_APP_API_URL;

const RagWidget = () => {
    // ================= STATES =================

    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState("");

    // Upload states
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");

    // Chat states
    const [answer, setAnswer] = useState("");
    const [asking, setAsking] = useState(false);

    // ================= FILE CHANGE =================

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        console.log("Selected file:", file);

        if (file) {
            setSelectedFile(file);
            setUploadMessage("");
        }
    };

    // ================= PDF UPLOAD =================

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage("Please select a PDF first.");
            return;
        }

        try {
            setUploading(true);
            setUploadMessage("Uploading and processing...");

            const formData = new FormData();

            // Backend multer expects "pdf"
            formData.append("pdf", selectedFile);

            console.log("Uploading:", selectedFile.name);

            const response = await fetch(
                "https://zerodha-backend-vuow.onrender.com/rag/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            console.log("Upload response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Upload failed"
                );
            }

            setUploadMessage(
                `✅ PDF uploaded successfully. ${data.chunks} chunks created.`
            );

        } catch (error) {
            console.error("UPLOAD ERROR:", error);

            setUploadMessage(
                `❌ ${error.message}`
            );

        } finally {
            setUploading(false);
        }
    };

    // ================= ASK QUESTION =================

    const handleAsk = async () => {
        if (!question.trim()) {
            return;
        }

        try {
            setAsking(true);
            setAnswer("");

            console.log("Question:", question);

            const response = await fetch(
                "https://zerodha-backend-vuow.onrender.com/rag/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        question: question,
                    }),
                }
            );

            const data = await response.json();

            console.log("Chat response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to get answer"
                );
            }

            setAnswer(data.answer);

        } catch (error) {
            console.error("CHAT ERROR:", error);

            setAnswer(
                `❌ ${error.message}`
            );

        } finally {
            setAsking(false);
        }
    };

    // ================= UI =================

    return (
        <div
            style={{
                position: "fixed",
                right: "25px",
                bottom: "25px",
                zIndex: 9999,
            }}
        >

            {/* ================= AI BUTTON ================= */}

            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: "#387ed1",
                    color: "white",
                    border: "none",
                    borderRadius: "50px",
                    padding: "14px 22px",
                    fontSize: "15px",
                    cursor: "pointer",
                    boxShadow:
                        "0 5px 15px rgba(0,0,0,0.25)",
                }}
            >
                🤖 AI Assistant
            </button>

            {/* ================= AI WINDOW ================= */}

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        right: "0",
                        bottom: "65px",
                        width: "360px",
                        height: "500px",
                        background: "white",
                        borderRadius: "15px",
                        boxShadow:
                            "0 5px 30px rgba(0,0,0,0.25)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >

                    {/* ================= HEADER ================= */}

                    <div
                        style={{
                            background: "#387ed1",
                            color: "white",
                            padding: "15px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <strong>
                                🤖 Zerodha AI
                            </strong>

                            <div
                                style={{
                                    fontSize: "12px",
                                    marginTop: "3px",
                                }}
                            >
                                Ask about your documents
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                setIsOpen(false)
                            }
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "white",
                                fontSize: "20px",
                                cursor: "pointer",
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* ================= UPLOAD ================= */}

                    <div
                        style={{
                            padding: "15px",
                            borderBottom:
                                "1px solid #eee",
                        }}
                    >

                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                        />

                        {/* Selected file */}

                        {selectedFile && (
                            <p
                                style={{
                                    fontSize: "13px",
                                    margin: "8px 0 0",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                📄 {selectedFile.name}
                            </p>
                        )}

                        {/* Upload button */}

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            style={{
                                width: "100%",
                                marginTop: "10px",
                                padding: "10px",
                                background:
                                    uploading
                                        ? "#999"
                                        : "#387ed1",
                                color: "white",
                                border: "none",
                                borderRadius: "7px",
                                cursor:
                                    uploading
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            {uploading
                                ? "Processing..."
                                : "Upload PDF"}
                        </button>

                        {/* Upload message */}

                        {uploadMessage && (
                            <p
                                style={{
                                    fontSize: "13px",
                                    marginTop: "10px",
                                    marginBottom: "0",
                                }}
                            >
                                {uploadMessage}
                            </p>
                        )}

                    </div>

                    {/* ================= CHAT ================= */}

                    <div
                        style={{
                            flex: 1,
                            padding: "15px",
                            background: "#f7f8fc",
                            overflowY: "auto",
                        }}
                    >

                        {/* Welcome message */}

                        <div
                            style={{
                                background: "white",
                                padding: "10px",
                                borderRadius: "10px",
                                marginBottom: "10px",
                                boxShadow:
                                    "0 1px 3px rgba(0,0,0,0.05)",
                            }}
                        >
                            👋 Upload a PDF and ask me
                            anything about it.
                        </div>

                        {/* User question */}

                        {question && (
                            <div
                                style={{
                                    background: "#387ed1",
                                    color: "white",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    marginLeft: "30px",
                                }}
                            >
                                {question}
                            </div>
                        )}

                        {/* Loading */}

                        {asking && (
                            <div
                                style={{
                                    background: "white",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                }}
                            >
                                🤖 Thinking...
                            </div>
                        )}

                        {/* AI answer */}

                        {answer && !asking && (
                            <div
                                style={{
                                    background: "white",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    boxShadow:
                                        "0 1px 3px rgba(0,0,0,0.05)",
                                }}
                            >
                                <strong>
                                    🤖 AI
                                </strong>

                                <div
                                    style={{
                                        marginTop: "6px",
                                    }}
                                >
                                    {answer}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* ================= QUESTION INPUT ================= */}

                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            padding: "10px",
                            borderTop:
                                "1px solid #eee",
                        }}
                    >

                        <input
                            value={question}
                            onChange={(e) =>
                                setQuestion(
                                    e.target.value
                                )
                            }
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    !asking
                                ) {
                                    handleAsk();
                                }
                            }}
                            placeholder="Ask something..."
                            style={{
                                flex: 1,
                                padding: "10px",
                                border:
                                    "1px solid #ddd",
                                borderRadius: "7px",
                                outline: "none",
                            }}
                        />

                        <button
                            onClick={handleAsk}
                            disabled={asking}
                            style={{
                                background:
                                    asking
                                        ? "#999"
                                        : "#387ed1",
                                color: "white",
                                border: "none",
                                borderRadius: "7px",
                                padding: "0 15px",
                                cursor:
                                    asking
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            {asking
                                ? "..."
                                : "Send"}
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};

export default RagWidget;
