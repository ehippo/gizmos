import React, { useState } from 'react';
import { API } from '../lib';
import BaseTool from '../components/BaseTool';
import { Select } from '../components/ui';

export default function JSONTool() {
  const [indent, setIndent] = useState(2);

  const process = async (val, mode) => {
    if (mode === 'format') {
      const res = await API.jsonFormat(val, indent);
      return res.valid ? res.output : { error: res.error };
    } else {
      const res = await API.jsonMinify(val);
      return res.valid ? res.output : { error: res.error };
    }
  };

  const SAMPLES = [
    { label: 'Basic User', value: `{"id":1,"name":"Alice Johnson","email":"alice@example.com"}` },
    { label: 'Nested List', value: `{"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}],"total":2}` },
    { label: 'API Response', value: `{"status":"success","code":200,"data":{"items":[{"id":"1","title":"Item 1"}]}}` },
  ];

  return (
    <BaseTool
      title="JSON"
      tabs={[
        { id: 'format', label: 'Format' },
        { id: 'minify', label: 'Minify' }
      ]}
      process={process}
      options={
        <Select
          label="Indentation"
          value={indent}
          onChange={v => setIndent(Number(v))}
          options={[
            { value: 2, label: '2 spaces' },
            { value: 4, label: '4 spaces' },
            { value: 8, label: '8 spaces' },
          ]}
        />
      }
      samples={SAMPLES}
    />
  );
}
