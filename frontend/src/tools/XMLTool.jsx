import React from 'react';
import { API } from '../lib';
import BaseTool from '../components/BaseTool';

export default function XMLTool() {
  const process = async (val) => await API.xmlFormat(val);
  return (
    <BaseTool
      title="XML Formatter"
      process={process}
      samples={[
        { label: 'Basic XML', value: '<root><user id="1"><name>John</name><email>john@example.com</email></user></root>' },
        { label: 'Nested tags', value: '<note><to>Tove</to><from>Jani</from><heading>Reminder</heading><body>Don\'t forget me this weekend!</body></note>' },
      ]}
    />
  );
}
