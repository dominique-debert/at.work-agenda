import React from "react";

export default ({ className, text }) => (
  <div class={`badge-status ${className}`}>{text}</div>
);
