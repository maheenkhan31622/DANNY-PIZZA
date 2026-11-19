import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Loader2 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { useFirebase } from '../context/FirebaseContext';
import { GoogleLogoIcon } from './Navbar';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signInWithGoogle, signingIn, authError, clearAuthError } = useFirebase();

  const handleGoogleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm rounded-2xl border border-red-500/25 bg-[#FFF8F8] dark:bg-[#17070A] text-[#1F0B0D] dark:text-white shadow-2xl overflow-hidden"
          >
            <div className="relative bg-gradient-to-r from-red-800 via-red-700 to-red-800 px-6 py-6 text-center text-white">
              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  onClose();
                }}
                aria-label="Close sign in dialog"
                className="absolute right-3 top-3 rounded-lg p-1.5 text-white/80 hover:bg-white/15 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mx-auto mb-3 h-16 w-16 rounded-full p-1 bg-white/20 shadow-lg">
                <img
                  src={RESTAURANT_INFO.logoUrl}
                  alt="DANNY PIZZA"
                  className="h-full w-full rounded-full object-cover bg-black"
                />
              </div>

              <h2 className="font-display text-2xl font-extrabold">
                Sign In to DANNY PIZZA
              </h2>
              <p className="mt-1 text-xs text-red-100/90">
                Save your delivery address, track live orders, and reorder favorites in one tap.
              </p>
            </div>

            <div className="p-6 space-y-4">
              {authError && (
                <div className="rounded-xl border border-red-500/30 bg-red-100 dark:bg-red-950/60 px-3.5 py-2.5 text-xs font-semibold text-red-700 dark:text-red-300">
                  {authError}
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-900/15 dark:border-white/20 bg-white dark:bg-[#230C11] hover:bg-red-50 dark:hover:bg-[#2E1016] px-4 py-3 text-sm font-bold text-[#1F0B0D] dark:text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {signingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin text-red-600" />
                ) : (
                  <GoogleLogoIcon className="h-5 w-5 shrink-0" />
                )}
                <span>{signingIn ? 'Connecting with Google...' : 'Continue with Google'}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5C3337] dark:text-red-200/65">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Secured by Google &amp; Firebase Authentication</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
