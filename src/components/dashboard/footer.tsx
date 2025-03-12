import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/10 py-4 mt-auto">
      <div className="container mx-auto px-4 flex justify-center md:justify-between items-center">
        <Link 
          href="https://www.dolcefrutti.com/"
          className="text-white/70 hover:text-white text-sm transition-colors"
        >
          {process.env.NEXT_PUBLIC_APP_NAME} - {process.env.NEXT_PUBLIC_APP_V}
        </Link>
        <div className="hidden md:flex space-x-4 text-xs text-white/50">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <span>© {new Date().getFullYear()} All Rights Reserved</span>
        </div>
      </div>
    </footer>
  )
}
