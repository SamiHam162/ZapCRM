import { Button } from '@/components/ui/button';

interface TopBarProps {
  title: string;
  onNewClient?: () => void;
}

export function TopBar({ title, onNewClient }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      {onNewClient && (
        <Button
          onClick={onNewClient}
          className="bg-zap-orange hover:bg-zap-orange-dark text-white"
        >
          לקוח חדש +
        </Button>
      )}
    </header>
  );
}
