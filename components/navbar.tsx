import { useRouter } from 'next/router'

import { useSession, signIn, signOut } from "next-auth/react"
import { usePlan } from '../lib/swr'
import { Button } from 'primereact/button';

const Navbar = () => {
  const { data: session, status } = useSession()
  const userEmail = session?.user?.name

  const router = useRouter()

  const { plan, isLoading: isLoadingPlan, isError: isErrorPlan } = usePlan(router.query.id)

  return (
    <div className='fixed top-0 w-full'>
      <nav className="flex flex-col justify-center overflow-hidden bg-gray-50">
        <div className='bg-blue-400'>
          <div className="flex items-center justify-between container mx-auto p-3">
            <div className="text-lg font-bold text-gray-100">Travel Planner</div>
            {
              plan &&
              <div className="text-lg font-bold text-gray-100">{plan.title}</div>
            }
            <div className="flex items-center space-x-5 text-gray-100">
              {
                router.pathname != "/" &&
                <Button icon="pi pi-home" rounded onClick={() => router.push('/plans')} />
              }
              {status === "authenticated" && <p>{userEmail}</p>}
              {router.pathname != "/" && (status === "authenticated" ? (
                <button onClick={() => signOut({ callbackUrl: `${window.location.origin}` })} className="rounded bg-gray-100 py-1 px-2 text-slate-500 shadow-md">Sign out</button>
              ) : (
                <button onClick={() => signIn()} className="rounded bg-gray-100 py-1 px-2 text-slate-500 shadow-md">Sign in</button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;