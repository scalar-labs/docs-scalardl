import React from 'react';
import Clarity from '@microsoft/clarity';

const projectId = "p90xsfjq8f"
Clarity.init(projectId);

// Default implementation that can be customized
export default function Root({children}) {
  return <>{children}</>;
}
