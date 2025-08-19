// DevNav.tsx – dev navigation header
import { Link } from 'react-router-dom';

export default function DevNav() {
  return (
    <nav className="flex gap-4 p-2 bg-gray-200">
      <Link to="/onboarding">Onboarding</Link>
      <Link to="/quiz">Quiz</Link>
      <Link to="/match">Match</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  );
}
