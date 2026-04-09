import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
