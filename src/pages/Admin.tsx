import React, { useEffect, useState } from 'react';
import { useEvent } from '../context/EventContext';
import { getStats, Stats } from '../api/sessions';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';

export default function Admin() {
  const { eventCode } = useEvent();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStats(eventCode);
        setStats(res);
      } catch (err: any) {
        setError(err.message ?? String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventCode]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {error && <ErrorBanner message={error} />}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="border rounded p-4 text-center">
            <div className="text-sm text-gray-500">Participants</div>
            <div className="text-2xl font-bold">{stats.participants}</div>
          </div>
          <div className="border rounded p-4 text-center">
            <div className="text-sm text-gray-500">Avg. Score</div>
            <div className="text-2xl font-bold">
              {stats.avgScore.toFixed(2)}
            </div>
          </div>
          <div className="border rounded p-4 text-center">
            <div className="text-sm text-gray-500">Green</div>
            <div className="text-2xl font-bold">{stats.colors.green}</div>
          </div>
          <div className="border rounded p-4 text-center">
            <div className="text-sm text-gray-500">Yellow</div>
            <div className="text-2xl font-bold">{stats.colors.yellow}</div>
          </div>
          <div className="border rounded p-4 text-center">
            <div className="text-sm text-gray-500">Red</div>
            <div className="text-2xl font-bold">{stats.colors.red}</div>
          </div>
        </div>
      )}
    </div>
  );
}
