import React, { useState } from "react";

const InputField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  touched,
  required = false,
  disabled = false,
}) => (
  <div className={`input-field ${error && touched ? "has-error" : ""}`}>
    <label htmlFor={id}>
      {label}
      {required && <span className="required">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
    />
    {error && touched && <div className="error-message">{error}</div>}
  </div>
);

const TextareaField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  touched,
  required = false,
  disabled = false,
  rows = 4,
}) => (
  <div className={`textarea-field ${error && touched ? "has-error" : ""}`}>
    <label htmlFor={id}>
      {label}
      {required && <span className="required">*</span>}
    </label>
    <textarea
      id={id}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      rows={rows}
    />
    {error && touched && <div className="error-message">{error}</div>}
  </div>
);

const CollapsibleSection = ({
  title,
  isOpen,
  onToggle,
  children,
  id,
  disabled = false,
}) => (
  <div className={`form-section collapsible ${isOpen ? "open" : "closed"}`}>
    <button
      type="button"
      className="section-header"
      onClick={disabled ? null : onToggle}
      style={{ cursor: disabled ? "default" : "pointer" }}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          onToggle();
        }
      }}
    >
      <h2>{title}</h2>
      <button
        type="button"
        className="toggle-button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) {
            onToggle();
          }
        }}
        disabled={disabled}
      >
        {isOpen ? "−" : "+"}
      </button>
    </button>
    <div className="section-content">{isOpen && children}</div>
  </div>
);

const ReflectionPrompts = ({
  selectedEmotions,
  formData,
  setFormData,
  onSubmit,
  isLocked = false,
  needsData = null,
}) => {
  const [openSections, setOpenSections] = useState({
    situation: true,
    emotions: true,
    perspective: false,
    resolution: false,
  });

  const handleChange = (field, value) => {
    if (isLocked) {
      return;
    }
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSectionToggle = (sectionId) => {
    if (isLocked) {
      return;
    }
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) {
      return;
    }

    // Add current date if not already set
    const dataToSubmit = {
      ...formData,
      date: formData.date || new Date().toLocaleDateString(),
    };

    onSubmit(dataToSubmit);
  };

  return (
    <div className="reflection-prompts">
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <h1>Conflict Reflection</h1>
          <p className="form-description">
            Reflect on your conflict situation, considering your emotions and
            needs. Take your time with each section - there are no right or
            wrong answers.
          </p>

          <div className="input-group">
            <InputField
              id="reflectionName"
              label="Give your reflection a name"
              value={formData.reflectionName || ""}
              onChange={(e) => handleChange("reflectionName", e.target.value)}
              placeholder="e.g., Work Conflict with Alex"
              disabled={isLocked}
            />

            <InputField
              id="date"
              label="Date"
              type="date"
              value={formData.date || ""}
              onChange={(e) => handleChange("date", e.target.value)}
              disabled={isLocked}
            />
          </div>
        </div>

        <CollapsibleSection
          title="Situation Details"
          isOpen={openSections.situation}
          onToggle={() => handleSectionToggle("situation")}
          disabled={isLocked}
        >
          <TextareaField
            id="situation"
            label="What happened? Describe the conflict situation."
            value={formData.situation || ""}
            onChange={(e) => handleChange("situation", e.target.value)}
            placeholder="Describe the events that led to this conflict..."
            rows={5}
            disabled={isLocked}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Emotional Response"
          isOpen={openSections.emotions}
          onToggle={() => handleSectionToggle("emotions")}
          disabled={isLocked}
        >
          <div className="selected-emotions-summary">
            <h3>Selected Emotions:</h3>
            <div className="emotions-grid">
              {selectedEmotions.map((emotion) => {
                if (typeof emotion === "string") {
                  return (
                    <div key={emotion} className="emotion-tag">
                      <span className="emotion-name">{emotion}</span>
                    </div>
                  );
                }
                return (
                  <div
                    key={emotion.name}
                    className="emotion-tag"
                    style={{ backgroundColor: emotion.color }}
                  >
                    <span className="emotion-icon">{emotion.icon}</span>
                    <span className="emotion-name">{emotion.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <TextareaField
            id="emotionalResponse"
            label="How did these emotions feel in your body? How intense were they?"
            value={formData.emotionalResponse || ""}
            onChange={(e) => handleChange("emotionalResponse", e.target.value)}
            placeholder="Describe your physical and emotional experience..."
            rows={4}
            disabled={isLocked}
          />

          <TextareaField
            id="triggers"
            label="What triggered these emotions? What needs were not being met?"
            value={formData.triggers || ""}
            onChange={(e) => handleChange("triggers", e.target.value)}
            placeholder="Identify what caused these emotions to arise..."
            rows={4}
            disabled={isLocked}
          />
        </CollapsibleSection>

        {needsData && (
          <div className="needs-summary-section">
            <h3>Needs Assessment Summary:</h3>
            {needsData.selectedLevel && (
              <div className="needs-category-summary">
                <h4>Primary Need Category: {needsData.selectedLevel.name}</h4>
                <p>{needsData.selectedLevel.description}</p>
              </div>
            )}

            {needsData.selectedNeeds && needsData.selectedNeeds.length > 0 && (
              <div className="selected-needs">
                <h4>Specific Needs:</h4>
                <div className="needs-tags">
                  {needsData.selectedNeeds.map((need) => (
                    <div key={need} className="need-tag">
                      {need}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <CollapsibleSection
          title="Perspective Taking"
          isOpen={openSections.perspective}
          onToggle={() => handleSectionToggle("perspective")}
          disabled={isLocked}
        >
          <TextareaField
            id="otherPerspective"
            label="How might the other person/people have perceived this situation? What needs might they have had?"
            value={formData.otherPerspective || ""}
            onChange={(e) => handleChange("otherPerspective", e.target.value)}
            placeholder="Try to imagine their perspective, feelings, and needs..."
            rows={5}
            disabled={isLocked}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Resolution Ideas"
          isOpen={openSections.resolution}
          onToggle={() => handleSectionToggle("resolution")}
          disabled={isLocked}
        >
          <TextareaField
            id="resolutionIdeas"
            label="What could help resolve this conflict? What actions could address everyone's needs?"
            value={formData.resolutionIdeas || ""}
            onChange={(e) => handleChange("resolutionIdeas", e.target.value)}
            placeholder="Brainstorm possible solutions that could work for all parties..."
            rows={5}
            disabled={isLocked}
          />

          <TextareaField
            id="learnings"
            label="What have you learned from this situation? How might you approach similar situations differently in the future?"
            value={formData.learnings || ""}
            onChange={(e) => handleChange("learnings", e.target.value)}
            placeholder="Reflect on your insights and growth from this experience..."
            rows={5}
            disabled={isLocked}
          />
        </CollapsibleSection>

        {!isLocked && (
          <div className="form-actions">
            <button type="submit" className="submit-button">
              Complete Reflection
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReflectionPrompts;
