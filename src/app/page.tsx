import DashboardPage from "@/components/DashboardPage";
import LoginOptions from "@/components/LoginOptions";
import { getAuthSession } from "@/lib/auth";

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      {session?.user ? (
        <DashboardPage session={session} />
      ) : (
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <LoginOptions />
        </div>
      )}
    </>
  );
}
