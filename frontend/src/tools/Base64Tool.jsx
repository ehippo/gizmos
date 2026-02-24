import React, { useState } from 'react';
import { API } from '../wailsbridge';
import BaseTool from '../components/BaseTool';
import { Toggle } from '../components/ui';

export default function Base64Tool() {
  const [urlSafe, setUrlSafe] = useState(false);

  const process = async (val, mode) => {
    if (mode === 'encode') {
      let result = await API.base64Encode(val);
      if (urlSafe) result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      return result;
    } else {
      let decoded = urlSafe ? val.replace(/-/g, '+').replace(/_/g, '/') : val;
      return await API.base64Decode(decoded);
    }
  };

  return (
    <BaseTool
      title="Base64"
      tabs={[
        { id: 'encode', label: 'Encode' },
        { id: 'decode', label: 'Decode' }
      ]}
      initialTab="encode"
      allowSwap
      process={process}
      options={
        <Toggle
          label="URL-safe"
          checked={urlSafe}
          onChange={setUrlSafe}
          desc="No padding, safe for URLs"
        />
      }
      samples={[
        { label: 'Hello, World!', value: 'Hello, World!' },
        { label: 'JSON snippet', value: '{"key":"value","num":42}' },
        { label: 'Lorem ipsum', value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
      ]}
    />
  );
}
