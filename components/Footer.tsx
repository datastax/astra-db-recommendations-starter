import { FacebookIcon, LinkedInIcon, TwitterIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="mt-12 pt-6 mb-20">
      <hr className='chatbot-divider w-full mb-12' />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-1">
          <ul>
            <li className="chatbot-footer-item-title">Shop</li>
            <li className="chatbot-footer-item"><a href="#">About Us</a></li>
            <li className="chatbot-footer-item"><a href="#">Contact</a></li>
            <li className="chatbot-footer-item"><a href="#">Careers</a></li>
          </ul>
        </div>
        <div className="col-span-1">
          <ul>
            <li className="chatbot-footer-item-title">Customer Service</li>
            <li className="chatbot-footer-item"><a href="#">FAQ</a></li>
            <li className="chatbot-footer-item"><a href="#">Returns</a></li>
            <li className="chatbot-footer-item"><a href="#">Privacy</a></li>
          </ul>
        </div>
        <div className="col-span-1">
          <ul>
            <li className="chatbot-footer-item-title">Quickstart</li>
            <li className="chatbot-footer-item"><a href="#">Placing An Order</a></li>
            <li className="chatbot-footer-item"><a href="#">Checkout</a></li>
            <li className="chatbot-footer-item"><a href="#">Payment Methods</a></li>
          </ul>
        </div>
        <div className="col-span-1">
          <span className="chatbot-footer-item-title">Stay Up To Date</span>
          <div className="flex gap-2 my-4">
            <div className="flex chatbot-input flex-1">
              <input className="text-sm" placeholder="Enter your email..." />
            </div>
            <button className='chatbot-button flex rounded-md items-center justify-center px-2.5'>
              <span className='font-semibold text-sm'>Register</span>
            </button>
          </div>
          <span className="chatbot-footer-item-title">Find Us On Social</span>
          <div className="flex gap-4 mt-4">
            <a href="#">
              <FacebookIcon />
            </a>
            <a href="#">
              <TwitterIcon />
            </a>
            <a href="#">
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <span className="text-textSecondaryInverse">© 2023 DataStax</span>
      </div>
    </footer>
  )
}