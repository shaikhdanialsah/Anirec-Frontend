import React from "react";
import Card from "react-bootstrap/Card";
import { motion } from "framer-motion";
import { AnimationControl, fadeIn } from "../../components/AnimationControl";

function AboutDescription() {
  const { ref, controls } = AnimationControl();

  return (
    <div>
      <iframe title="FYP" width="100%" style={{height:'80vh'}} src="https://app.powerbi.com/view?r=eyJrIjoiMjI5YmQwODctMTkzOC00Y2UxLTgyZjAtYzRhN2QwNTI5MGZiIiwidCI6ImNkY2JiMGUyLTlmZWEtNGY1NC04NjcwLTY3MjcwNzc5N2FkYSIsImMiOjEwfQ%3D%3D" frameBorder="0" allowFullScreen="true"></iframe>
    </div>
  );
}

export default AboutDescription;
