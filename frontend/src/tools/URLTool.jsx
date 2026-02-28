import React from 'react';
import { API } from '../lib';
import BaseTool from '../components/BaseTool';

export default function URLTool() {
  const process = async (val, mode) => {
    return mode === 'encode' ? await API.urlEncode(val) : await API.urlDecode(val);
  };

  return (
    <BaseTool
      title="URL Encoder/Decoder"
      tabs={[
        { id: 'encode', label: 'Encode' },
        { id: 'decode', label: 'Decode' }
      ]}
      process={process}
      allowSwap
      samples={[
        { label: 'Query params', value: 'https://example.com/search?q=hello world&category=tools&id=123' },
        { label: 'Special chars', value: 'Hello World! @#$%^&*()' },
      ]}
    />
  );
}
