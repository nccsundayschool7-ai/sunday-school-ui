'use client';
import { useRef, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function KioskPage(){
  const ref = useRef<HTMLDivElement>(null);
  const [msg, setMsg] = useState("");
  const [lastScan, setLastScan] = useState<string>("");

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

  async function mark(code: string){
    const res = await fetch('/api/attendance/mark', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ code }) });
    if (!res.ok) {
      const j = await res.json().catch(()=>({}));
      throw new Error(j.error || `HTTP ${res.status}`);
    }
  }

  async function handleScan(input: string){
    const text = String(input || '').trim();
    if (!text || text === lastScan) return;
    setLastScan(text);
    try{
      await mark(text);
      localStorage.setItem('attendance_marked','1');
      localStorage.setItem('last_scanned_code', text);
      setMsg(`Marked present: ${text}`);
    } catch(e:any){
      setMsg(e.message.includes('NOT_FOUND') ? `Not found: ${text}` : `Error: ${e.message || e}`);
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
        <div className="card space-y-3">
          <div className="font-semibold">Scan QR</div>
          <Scanner
            constraints={{ facingMode: 'environment' }}
            onScan={(result)=> result && handleScan(String(result[0]?.rawValue || result))}
            onError={(err)=> setMsg(`Camera error: ${String(err)}`)}
            styles={{ container: { width: '100%' } }}
          />
          <input className="input" placeholder="Paste QR ID here" onChange={e=>handleScan(e.target.value)} />
          <p className="text-xs opacity-70">Allow camera permission to scan. Or paste QR ID to simulate.</p>
        </div>
        <div className="card">
          <div className="font-semibold mb-2">Manual Mark</div>
          <p className="text-sm opacity-70">Coming soon: quick search and tap-to-mark.</p>
        </div>
      </div>
    </div>
  )
}