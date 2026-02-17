/**
 * Reports Page
 * Generate and view incident reports
 */

export default function ReportsPage() {
  return (
    <div className="h-full p-6 overflow-y-auto" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
          Reports
        </h1>
        <p className="mb-6" style={{ color: 'var(--muted-foreground)' }}>
          Generate and export incident reports
        </p>

        <div
          className="rounded-lg border p-6"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <p style={{ color: 'var(--muted-foreground)' }}>
            Report generation will be added in future phases
          </p>
        </div>
      </div>
    </div>
  );
}
