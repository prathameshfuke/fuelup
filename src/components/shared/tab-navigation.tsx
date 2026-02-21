'use client';

interface Tab<T> {
  id: T;
  label: string;
}

interface TabNavigationProps<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export function TabNavigation<T extends string>({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps<T>) {
  return (
    <div className="border-b border-[#2a2d3a] bg-[#0a0b10] px-6 py-3 flex gap-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`text-sm font-bold tracking-widest transition py-2 px-1 border-b-2 ${
            activeTab === tab.id
              ? 'text-white border-[#0bda62]'
              : 'text-[#64748b] border-transparent hover:text-[#94a3b8]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
