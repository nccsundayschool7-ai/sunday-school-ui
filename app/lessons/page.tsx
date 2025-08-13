export default function LessonsPage(){
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Lessons (This Week)</h2>
      <div className="card">
        <div className="font-semibold">Title: The Good Samaritan</div>
        <div className="text-sm opacity-80">Scripture: Luke 10:25-37</div>
        <p className="mt-2 text-sm">Summary: Understanding love for neighbor with activities for each age group.</p>
      </div>
      <div className="card">
        <div className="font-semibold">Next Week Preview</div>
        <div className="text-sm opacity-80">Title: The Armor of God — Ephesians 6</div>
      </div>
    </div>
  )
}