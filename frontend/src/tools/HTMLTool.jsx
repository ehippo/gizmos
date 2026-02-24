import React from 'react';
import { API } from '../wailsbridge';
import BaseTool from '../components/BaseTool';

export default function HTMLTool() {
  const process = async (val) => await API.htmlFormat(val);
  return (
    <BaseTool
      title="HTML Formatter"
      process={process}
      samples={[
        { label: 'Basic structure', value: '<div><h1>Title</h1><p>Paragraph with <b>bold</b> text.</p><ul><li>One</li><li>Two</li></ul></div>' },
      ]}
    />
  );
}
