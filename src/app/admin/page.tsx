import AdminPanel from "./admin-panel";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-[var(--color-text-primary)]">
          Admin Panel
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
          Manage seed data and session cleanup
        </p>
      </div>
      <AdminPanel />
    </div>
  );
}
