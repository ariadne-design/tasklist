'use client';
import { store } from '@/store';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <div className="w-full h-screen">
        <div>{children}</div>
      </div>
    </Provider>
  );
}
