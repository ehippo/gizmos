import React from 'react';
import { API } from '../lib';
import BaseTool from '../components/BaseTool';

export default function CSSTool() {
  const process = async (val, mode) => {
    return mode === 'format' ? await API.cssFormat(val) : await API.cssMinify(val);
  };

  return (
    <BaseTool
      title="CSS Formatter/Minifier"
      tabs={[
        { id: 'format', label: 'Format' },
        { id: 'minify', label: 'Minify' }
      ]}
      process={process}
      samples={[
        { label: 'Basic CSS', value: '.container { width: 100%; margin: 0 auto; padding: 20px; } .btn { color: white; background-color: blue; }' },
      ]}
    />
  );
}
