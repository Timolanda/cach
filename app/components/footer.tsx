import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/about" className="text-base text-gray-300 hover:text-white">About</Link></li>
              <li><Link href="/careers" className="text-base text-gray-300 hover:text-white">Careers</Link></li>
              <li><Link href="/contact" className="text-base text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/blog" className="text-base text-gray-300 hover:text-white">Blog</Link></li>
              <li><Link href="/faq" className="text-base text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link href="/support" className="text-base text-gray-300 hover:text-white">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/privacy" className="text-base text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-base text-gray-300 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Twitter</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">LinkedIn</a></li>
              <li><a href="#" className="text-base text-gray-300 hover:text-white">Discord</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">&copy; 2023 Cach. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

