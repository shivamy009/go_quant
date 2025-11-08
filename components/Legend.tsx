// components/Legend.tsx
export default function Legend() {
  return (
    <div className="bg-slate-800 p-3 rounded">
      <div className="text-sm font-semibold mb-2">Legend</div>
      <ul className="text-sm">
        <li><span className="inline-block w-3 h-3 mr-2 bg-[#00ff7f] align-middle" /> &lt; 50 ms</li>
        <li><span className="inline-block w-3 h-3 mr-2 bg-[#ffeb3b] align-middle" /> 50–150 ms</li>
        <li><span className="inline-block w-3 h-3 mr-2 bg-[#ff4d4f] align-middle" /> &gt; 150 ms</li>
        <li><span className="inline-block w-3 h-3 mr-2 bg-[#888888] align-middle" /> timeout / error</li>
      </ul>
    </div>
  );
}
