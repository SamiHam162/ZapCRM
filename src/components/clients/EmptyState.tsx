interface EmptyStateProps {
  onNewClient: () => void;
}

export function EmptyState({ onNewClient }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl mb-4">📋</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        עדיין אין לקוחות ברשימה
      </h2>
      <p className="text-gray-500 mb-6 max-w-sm">
        הוסף את הלקוח הראשון שלך כדי להתחיל בתהליך האונבורדינג
      </p>
      <button
        onClick={onNewClient}
        className="bg-zap-orange hover:bg-zap-orange-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        הוסף לקוח ראשון
      </button>
    </div>
  );
}
