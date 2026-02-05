import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Loader, XCircle } from "lucide-react";
import Navbar from "../Navbar/Navbar";
import "./CodeReviewAgent.css";

// --- Reusable Hook for Auto-Resizing Textarea ---
const useAutoResizeTextarea = ({ minHeight, maxHeight }) => {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback((reset = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (reset) {
      textarea.style.height = `${minHeight}px`;
      return;
    }

    textarea.style.height = "auto";
    const newHeight = Math.max(
      minHeight,
      Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
    );
    textarea.style.height = `${newHeight}px`;
  }, [minHeight, maxHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
};

// --- Animated Placeholder Component ---
const AnimatedPlaceholder = () => (
  <motion.p
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
    transition={{ duration: 0.2 }}
    className="placeholder-text"
  >
    <Bot size={16} className="placeholder-icon" />
    Paste your code for an AI review...
  </motion.p>
);

// --- Main Code Review Agent Component ---
export default function CodeReviewAgent() {
  const [codeContent, setCodeContent] = useState("");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const MIN_HEIGHT = 52;
  const MAX_HEIGHT = 250;
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });

  const handleReview = async () => {
    if (!codeContent.trim()) return;
    
    setError("");
    setReview("");
    setIsLoading(true);

    const prompt = `
      As an expert code reviewer, please analyze the following code snippet.
      Provide a concise, clear, and actionable review. 

      **IMPORTANT: Format your entire response using GitHub Flavored Markdown.**

      Use the following structure:
      - A main heading '### Code Review'.
      - Use blockquotes (>) for any **critically important** suggestions or tips.
      - Use bolding (**) for key terms.
      - Use bullet points (-) for specific suggestions.
      - Use inline code blocks (\`) for variable names and short snippets.
      
      Focus on:
      1.  **Readability & Clarity**
      2.  **Potential Bugs & Edge Cases**
      3.  **Best Practices & Performance**
      4.  **Security Vulnerabilities**

      Here is the code to review:
      \`\`\`
      ${codeContent}
      \`\`\`
    `;

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // The API URL now points to our local Vite proxy
    const apiUrl = `/gemini/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with status: ${response.status}. ${errorText}`);
        }
        
        const result = await response.json();
        const reviewText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (reviewText) {
            setReview(reviewText);
            setCodeContent("");
            adjustHeight(true);
        } else {
            console.error("Unexpected API response structure:", result);
            setError("The AI returned an unexpected response. Please try again.");
        }
    } catch (e) {
        console.error("Failed to fetch from proxy:", e);
        setError("An error occurred while fetching the review. Check the console for details.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReview();
    }
  };

  const handleInputChange = (e) => {
    setCodeContent(e.target.value);
    adjustHeight();
  };
  
  return (
    <>
      <Navbar />
      <section className="agent-page-container">
        <header className="agent-header">
          
           <h2>
             AI Code Quality  <span className="dash-username">Agent !</span>
            </h2>
            <p className="dashboard-header-sub">
              Review Your Code: Get instant feedback on code quality, best practices, and potential bugs.
            </p>
        </header>

        <div className="agent-input-wrapper">
          <div className="agent-input-main">
            <div className="textarea-container" style={{ maxHeight: `${MAX_HEIGHT}px` }}>
              <textarea
                ref={textareaRef}
                value={codeContent}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="agent-textarea"
                placeholder=""
                style={{ height: `${MIN_HEIGHT}px` }}
                disabled={isLoading}
              />
              {!codeContent && <AnimatedPlaceholder />}
            </div>

            <div className="input-footer">
              <button
                type="button"
                onClick={handleReview}
                disabled={!codeContent.trim() || isLoading}
                className="send-button"
              >
                {isLoading ? <Loader size={18} className="spinner" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="agent-results-container">
            {error && (
                 <div className="result-card error-card">
                    <XCircle size={20} />
                    <p>{error}</p>
                 </div>
            )}
            {review && (
                <div className="result-card">
                    <div className="review-output-formatted">
                      <ReactMarkdown>{review}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
      </section>
    </>
  );
}