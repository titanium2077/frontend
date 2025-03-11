export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-400 text-center p-4 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Kawaiee. All rights reserved.
          </p>
          {/* <div className="flex justify-center space-x-4 mt-2">
            <a href="/terms" className="hover:text-white transition">
              Terms of Service
            </a>
            <span className="text-gray-600">|</span>
            <a href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </a>
          </div> */}
        </div>
      </footer>
    );
  }
  