import Link from "next/link";

const Home = () => {
  return (
    <main className="flex items-center justify-center min-h-screen p-24">
      <div className="h-96 w-96 flex items-center justify-center">
        <Link
          className="text-white font-bold bg-blue-500 rounded-full px-4 py-2 hover:opacity-90"
          href={`/trials`}
          rel="noopener noreferrer"
        >
          Go to Trials
        </Link>
      </div>
    </main>
  );
};

export default Home;
