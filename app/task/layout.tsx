'use client';
import { store } from '@/store';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <div className="flex h-10  items-center justify-center bg-gray-200">
          adad
        </div>
        <div className="flex min-h-0 flex-1  items-center justify-center">
          {children}
        </div>
        <div className="flex h-[100px] w-24 items-center justify-center bg-gray-200">
          footer
        </div>
      </div>
    </Provider>
  );
}
