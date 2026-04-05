import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-screen">
      <div>{children}</div>
    </div>
  );
}
