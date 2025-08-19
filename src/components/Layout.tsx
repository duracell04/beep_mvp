import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-screen-md p-4 md:p-6 lg:max-w-screen-lg">
        <Outlet />
      </main>
    </div>
  );
}
