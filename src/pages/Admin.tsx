import { useEffect, useState } from 'react';
import { useEvent } from '../context/EventContext';
import { getStats, Stats } from '../api/sessions';
import Spinner from '../components/Spinner';
import Alert from '../components/ui/Alert';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

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
    <div className="flex flex-col gap-4 p-4">
      {error && <Alert variant="error" children={error} />}
      {stats ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Card className="text-center">
            <CardHeader className="text-sm text-slate-500 dark:text-slate-400">
              Participants
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.participants}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="text-sm text-slate-500 dark:text-slate-400">
              Avg. Score
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.avgScore.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="text-sm text-slate-500 dark:text-slate-400">
              Green
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.colors.green}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="text-sm text-slate-500 dark:text-slate-400">
              Yellow
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.colors.yellow}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="text-sm text-slate-500 dark:text-slate-400">
              Red
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.colors.red}</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center">
          <CardHeader>No data</CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Configure Supabase environment variables to view stats.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
