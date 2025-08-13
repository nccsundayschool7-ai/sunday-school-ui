export default function ReportsPage(){
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Reports & Exports</h2>
      <div className="card">
        <div className="font-medium">Monthly Attendance Export (Excel)</div>
        <p className="text-sm opacity-80">In the live app, click to export Students, Leaders, Absentees as .xlsx with monthly & yearly %.</p>
        <button className="btn btn-primary mt-3" disabled>Export (Preview)</button>
      </div>
    </div>
  )
}