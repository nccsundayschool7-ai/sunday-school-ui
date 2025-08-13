'use client';
import { useRef, useState } from "react";

export default function KioskPage(){
  const ref = useRef<HTMLDivElement>(null);
  const [msg, setMsg] = useState("");

  async function goFullscreen(){
    if (!ref.current || !document.fullscreenEnabled || !ref.current.requestFullscreen) {
      setMsg("Fullscreen not available. Using kiosk layout.");
      return;
    }
    try{
      await ref.current.requestFullscreen();
      setMsg("Fullscreen enabled.");
    } catch {
      setMsg("Fullscreen blocked by browser. Using kiosk layout.");
    }
  }

  return (
    <div ref={ref} className="space-y-4 min-h-[70vh]">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Kiosk Mode</h2>
        <button className="btn btn-primary" onClick={goFullscreen}>Fullscreen</button>
        <div className="text-sm opacity-70">{msg}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="font-semibold mb-2">Scan QR (preview)</div>
          <input className="input" placeholder="Paste QR ID here to simulate scan" />
          <p className="text-xs opacity-70 mt-2">Camera access is disabled in the preview build; will be enabled with backend.</p>
        </div>
        <div className="card">
          <div className="font-semibold mb-2">Manual Mark</div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({length:12}).map((_,i)=>(
              <button key={i} className="btn btn-ghost border">{`Student ${i+1}`}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}