import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Register - Havenx',
};

export default function RegisterPage() {
   return (
      <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
         <div className="w-full max-w-md bg-card-light dark:bg-card-dark rounded-3xl p-8 border border-white/50 dark:border-gray-800 shadow-soft backdrop-blur-sm relative z-10">
            <div className="flex items-center justify-center gap-2 mb-8 text-primary dark:text-white">
               <span className="material-symbols-outlined text-4xl">maps_home_work</span>
               <span className="text-3xl font-bold tracking-tight">Havenx</span>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">Create an account</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
               Join Havenx. Provide your details below.
            </p>

            <form className="space-y-5">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="name">
                     Full Name
                  </label>
                  <div className="relative group">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-primary dark:group-focus-within:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                     </span>
                     <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 shadow-sm backdrop-blur-sm"
                        placeholder="John Doe"
                     />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="email">
                     Email
                  </label>
                  <div className="relative group">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-primary dark:group-focus-within:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                     </span>
                     <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 shadow-sm backdrop-blur-sm"
                        placeholder="you@example.com"
                     />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="password">
                     Password
                  </label>
                  <div className="relative group">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-primary dark:group-focus-within:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                     </span>
                     <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 shadow-sm backdrop-blur-sm"
                        placeholder="••••••••"
                     />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="role">
                     I want to become a
                  </label>
                  <div className="relative group">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 z-10 group-focus-within:text-primary dark:group-focus-within:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">badge</span>
                     </span>
                     <select
                        id="role"
                        name="role"
                        required
                        className="w-full pl-11 pr-10 py-3.5 appearance-none rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-white focus:border-transparent outline-none transition-all cursor-pointer shadow-sm backdrop-blur-sm"
                        defaultValue="MENTEE"
                     >
                        <option value="MENTEE">Mentee (Learn and grow)</option>
                        <option value="MENTOR">Mentor (Share knowledge)</option>
                     </select>
                     <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                     </span>
                  </div>
               </div>

               <div className="pt-2">
                  <button
                     type="submit"
                     className="w-full flex justify-center items-center gap-2 px-6 py-4 rounded-2xl bg-primary text-white text-sm font-semibold shadow-md hover:bg-opacity-90 hover:-translate-y-0.5 transition-all"
                  >
                     Sign Up
                     <span className="material-symbols-outlined text-lg">person_add</span>
                  </button>
               </div>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
               Already have an account?{' '}
               <Link href="/login" className="font-semibold text-primary dark:text-white hover:text-accent-orange dark:hover:text-accent-orange transition-colors">
                  Sign in
               </Link>
            </div>
         </div>
      </div>
   );
}
