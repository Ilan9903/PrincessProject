import { Link } from 'react-router-dom';

const HomeButton = () => (
  <Link
    to="/"
    className="fixed top-6 left-6 text-gray-400 hover:text-red-500 z-50 p-2 text-2xl active:scale-95 shadow-2xl border border-pink-100 dark:border-gray-700 rounded-full hover:shadow-lg bg-white dark:bg-gray-800 transition-colors hover:cursor-pointer"
  >
    🏠
  </Link>
);

export default HomeButton;
