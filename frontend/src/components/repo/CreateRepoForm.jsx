import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateRepoForm.css";
import { useAuth } from "../../authContext"; // 1. Import useAuth

const CreateRepoForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth(); // 2. Get the current user from context
  const navigate = useNavigate();

  // ... (handleFilesChange and handleRemoveFile functions remain the same) ...
  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => {
      const allFiles = [...prev];
      newFiles.forEach(file => {
        if (!allFiles.some(f => f.name === file.name && f.lastModified === file.lastModified)) {
          allFiles.push(file);
        }
      });
      return allFiles;
    });
    e.target.value = "";
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || files.length === 0) {
      alert("Repository name and at least one file are required.");
      return;
    }
    
    // 3. Check for the currentUser._id from context
    if (!currentUser?._id) { 
      alert("User not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description);
      formData.append("visibility", visibility);
      
      // 4. Append the correct ID
      formData.append("owner", currentUser._id); 
      
      files.forEach(file => formData.append("files", file));

      const res = await fetch("http://localhost:3000/repo/create", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        alert("Repository created successfully!");
        navigate(`/repo/${data.repositoryID}`);
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to create repository! ${errorData.error || ""}`);
      }
    } catch (err) {
      alert("An error occurred while creating repository.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="create-repo-form-wrapper">
      <h1>Create New Repository</h1>
      {/* Your form JSX remains exactly the same */}
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="create-repo-form">
        {/* ...all your input fields... */}
        <label htmlFor="name">Repository Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter repository name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="off"
        />

        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          name="description"
          placeholder="Add a brief description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <label htmlFor="files">Upload Code Files</label>
        <input
          id="files"
          name="files"
          type="file"
          multiple
          accept=".zip,.tar,.js,.py,.cpp,.java,.txt"
          onChange={handleFilesChange}
        />

        <div className="selected-files-list">
          {files.length > 0 && (
            <ul>
              {files.map((file, idx) => (
                <li key={idx}>
                  {file.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    style={{
                      marginLeft: "8px",
                      color: "#f44336",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label htmlFor="visibility">Repository Visibility</label>
        <select
          id="visibility"
          name="visibility"
          value={visibility.toString()}
          onChange={(e) => setVisibility(e.target.value === "true")}
        >
          <option value="true">Public</option>
          <option value="false">Private</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Repository"}
        </button>
      </form>
    </div>
  );
};

export default CreateRepoForm;