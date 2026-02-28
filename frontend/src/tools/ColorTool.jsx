import React, { useState, useCallback, useEffect } from 'react';
import { Panel, Btn, Alert, PropertyTable, PropertyRow, ToolGrid, ToolLayout, TextInput, ToolHeader } from '../components/ui';
import { API } from '../lib';
import { Palette, Pipette } from 'lucide-react';

const PALETTE = [
  '#7c6af7', '#3ecfb0', '#f7a26a', '#f76a6a', '#6af7c8',
  '#f7e26a', '#6aadf7', '#c86af7', '#f76ab0', '#7af76a',
  '#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560',
  '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2',
];

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function luminance(hex) {
  try {
    const { r, g, b } = hexToRgb(hex);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  } catch { return 0; }
}

export default function ColorTool() {
  const [hex, setHex] = useState('#7c6af7');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [pickerHex, setPickerHex] = useState('#7c6af7');

  const convert = useCallback(async (val) => {
    setError('');
    const h = val.startsWith('#') ? val : '#' + val;
    if (!/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(h)) {
      if (val.length > 2) setError('Enter a valid HEX (e.g. #7c6af7)');
      return;
    }
    try {
      const r = await API.hexToColor(h);
      setResult(r);
      setPickerHex(h);
    } catch (e) { setError(String(e)); }
  }, []);

  const handleHex = (val) => { setHex(val); convert(val); };
  const handlePicker = (val) => {
    setPickerHex(val); setHex(val); convert(val);
  };

  useEffect(() => { convert('#7c6af7'); }, []);

  const textColor = result ? (luminance(result.hex) > 128 ? '#111' : '#fff') : '#fff';

  return (
    <ToolLayout>
      <ToolHeader>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <Btn variant="ghost" size="sm" onClick={() => { setHex(''); setResult(null); setPickerHex('#7c6af7'); }}>Clear</Btn>
        </div>
      </ToolHeader>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 12, flex: 1, minHeight: 0 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel title="Color Selection">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ position: 'relative', width: 52, height: 52, overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
                <input
                  type="color"
                  value={pickerHex}
                  onChange={e => handlePicker(e.target.value)}
                  style={{
                    position: 'absolute', top: -5, left: -5, width: 70, height: 70, border: 'none',
                    cursor: 'pointer', padding: 0, background: 'none',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextInput
                  value={hex}
                  onChange={handleHex}
                  placeholder="#7c6af7"
                  mono
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {result && (
              <div style={{
                height: 80, border: '1px solid var(--border)',
                background: result.hex, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 2,
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: textColor }}>
                  {result.hex.toUpperCase()}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, color: textColor, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {luminance(result.hex) > 128 ? 'Light Color' : 'Dark Color'}
                </span>
              </div>
            )}

            {error && <Alert type="error" message={error} style={{ marginTop: 8 }} />}
          </Panel>

          <Panel title="Quick Palette">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
              {PALETTE.map(c => (
                <button
                  key={c}
                  onClick={() => { setHex(c); convert(c); }}
                  title={c}
                  style={{
                    aspectRatio: '1', width: '100%', background: c, cursor: 'pointer',
                    border: hex.toLowerCase() === c.toLowerCase() ? '2px solid var(--text-1)' : '1px solid rgba(0,0,0,0.15)',
                    transition: 'opacity 0.1s',
                  }}
                />
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Panel title="Conversion Formats" success={!!result} style={{ flex: 1 }}>
            {result ? (
              <PropertyTable>
                <PropertyRow label="HEX" value={result.hex.toUpperCase()} accent />
                <PropertyRow label="RGB" value={result.rgb} />
                <PropertyRow label="RGBA" value={result.rgba} />
                <PropertyRow label="HSL" value={result.hsl} />
                <PropertyRow label="Luminance" value={Math.round(luminance(result.hex))} />
              </PropertyTable>
            ) : (
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-4)', flexDirection: 'column', gap: 16
              }}>
                <Palette size={64} opacity={0.1} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Select a color to see conversion formats</span>
              </div>
            )}
          </Panel>

          <Panel title="Usage Tips">
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
              <ul style={{ paddingLeft: 18 }}>
                <li>Supports 3 and 6 digit HEX codes</li>
                <li>Live preview updates as you type</li>
                <li>Click on HEX values above to copy them</li>
                <li>Use the Pipette icon on the left to open system color picker</li>
              </ul>
            </div>
          </Panel>
        </div>
      </div>
    </ToolLayout>
  );
}
