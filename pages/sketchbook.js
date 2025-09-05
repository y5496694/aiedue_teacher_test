import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Excalidraw is loaded only on the client to avoid SSR issues.
const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  {
    ssr: false,
    loading: () => <div>Loading sketchbook...</div>,
  }
);

export default function Sketchbook() {
  const apiRef = useRef(null);
  const [initialData, setInitialData] = useState(null);

  // Load saved scene from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('my-excalidraw-scene');
    if (saved) {
      try {
        setInitialData(JSON.parse(saved));
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  // Persist scene to localStorage whenever it changes
  const onChange = useCallback((elements, appState, files) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      'my-excalidraw-scene',
      JSON.stringify({ elements, appState, files })
    );
  }, []);

  // Export the current scene as a PNG file
  const exportPNG = useCallback(async () => {
    if (!apiRef.current) return;
    const { exportToBlob } = await import('@excalidraw/excalidraw');
    const elements = apiRef.current.getSceneElements();
    const appState = apiRef.current.getAppState();
    const files = apiRef.current.getFiles();
    const blob = await exportToBlob({ elements, appState, files });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (appState.name || 'excalidraw') + '.png';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <>
      <Head>
        <title>에이두 스케치북</title>
      </Head>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 8, borderBottom: '1px solid #eee' }}>
          <button onClick={exportPNG}>PNG로 저장</button>
          <label style={{ marginLeft: 8 }}>
            <input
              type="file"
              accept=".excalidraw,application/json"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !apiRef.current) return;
                const text = await file.text();
                try {
                  const data = JSON.parse(text);
                  apiRef.current.updateScene(data);
                } catch {
                  // ignore invalid file
                }
              }}
            />
            JSON 불러오기
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <Excalidraw
            ref={apiRef}
            initialData={initialData}
            onChange={onChange}
            UIOptions={{ canvasActions: { toggleTheme: true } }}
          />
        </div>
      </div>
    </>
  );
}
