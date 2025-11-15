import React from "react";
import { getVersionInfo } from "../../../utils/versionUtils";

const FeedbackSystem = ({ showSuccessFeedback }) => (
	<>
		{showSuccessFeedback && (
			<div className="success-message">
				<span className="success-text">Access Granted</span>
				<div className="version-info">{getVersionInfo()}</div>
			</div>
		)}
	</>
);

export default FeedbackSystem;
