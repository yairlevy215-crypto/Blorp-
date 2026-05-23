export default function LoginPage() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background noise */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, #00ff88 0px, transparent 1px, transparent 8px)',
      }} />

      <div className="relative z-10 text-center max-w-md w-full">
        <h1
          className="font-glitch text-8xl text-neon animate-glitch mb-2 select-none"
          style={{ letterSpacing: '0.1em' }}
        >
          BLORP
        </h1>
        <p className="text-muted text-sm mb-1 font-glitch text-xl">the social network for people who exist</p>
        <p className="text-dim text-xs mb-12">™ Ministry of Whatever, all rights reserved probably</p>

        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-white text-lg font-semibold">Join the chaos</p>
            <p className="text-muted text-sm">Your posts will be described in ways you cannot control.</p>
            <p className="text-muted text-sm">Your score will change for no reason.</p>
            <p className="text-muted text-sm">You will enjoy this.</p>
          </div>

          <a
            href="/auth/google"
            className="flex items-center justify-center gap-3 w-full bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>

          <p className="text-xs text-dim">
            By logging in you accept that your score may change because a cat sneezed.
          </p>
        </div>
      </div>
    </div>
  )
}
