import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faInstagram,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

import {
  faShoppingBag,
  faArrowUpRightFromSquare,
  faHeart,
  faEnvelope,
  faPhone,
  faLocationDot,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const socialLinks = [
    { icon: faInstagram, href: "#", label: "Instagram" },
    { icon: faGithub, href: "#", label: "GitHub" },
    { icon: faLinkedin, href: "#", label: "LinkedIn" },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Shop Products", path: "/products" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Compare Products", path: "/compare" },
    { name: "Shopping Cart", path: "/cart" },
  ];

  const supportLinks = [
    { name: "My Account", path: "/profile" },
    { name: "Track Orders", path: "/track-orders" },
    { name: "AI Shopping Assistant", path: "/assistant" },
    { name: "Contact Us", path: "mailto:support@shopsphere.com" },
  ];

  return (
    <footer className="bg-whitesmoke text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div>
            <Link to="/" className="mb-5 inline-flex items-center gap-3">
              <span className="text-2xl font-bold tracking-tight text-black">
                Shop<span className="text-orange-500"> Sphere</span>
              </span>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-7 text-gray-400">
              Discover quality products, explore amazing collections, and enjoy
              a seamless shopping experience with ShopSphere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>

            <ul className="space-y-4 text-sm text-gray-400">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="transition-colors duration-300 hover:pl-1 hover:text-orange-500"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Customer Support</h3>

            <ul className="space-y-4 text-sm text-gray-400">
              {supportLinks.map((item) => (
                <li key={item.name}>
                  {item.path.startsWith("mailto:") ? (
                    <a
                      href={item.path}
                      className="transition-colors duration-300 hover:text-orange-500"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className="transition-colors duration-300 hover:text-orange-500"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="mb-6 text-lg font-semibold">Get In Touch</h3>

            <div className="space-y-5 text-sm text-gray-400">
              <a
                href="mailto:support@shopsphere.com"
                className="flex items-start gap-3 transition hover:text-orange-500"
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mt-1 text-orange-500"
                />
                support@shopsphere.com
              </a>

              <a
                href="tel:+919876543210"
                className="flex items-start gap-3 transition hover:text-orange-500"
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  className="mt-1 text-orange-500"
                />
                +91 98765 43210
              </a>

              <p className="flex items-start gap-3 text-gray-400 ">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="mt-1 text-orange-500"
                />
                India
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-14 flex flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:flex-row md:items-center lg:p-8">
          <div>
            <h3 className="text-xl font-semibold">Stay in the loop!</h3>

            <p className="mt-2 text-sm text-gray-400">
              Subscribe to get updates about new products and exclusive offers.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md gap-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-orange-500"
            />

            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold transition hover:bg-orange-600"
            >
              Subscribe
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>

        {/* Bottom Footer */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-7 text-center text-sm   md:flex-row">
          <p className="text-gray-400">
            © {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>

          <p>
            Developed by{" "}
            <span className="font-semibold text-white">
              {" "}
              Developed by Vamsi Naidana
            </span>
            <span className="mx-1  text-white">|</span>
            <span className="font-semibold text-white">Internmo</span>
          </p>

          <div className="flex gap-5">
            <Link to="/" className="transition hover:text-orange-500">
              Privacy Policy
            </Link>

            <Link to="/" className="transition hover:text-orange-500">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
