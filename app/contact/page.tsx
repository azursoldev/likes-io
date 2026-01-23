import type { Metadata } from "next";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactPage from "../components/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us | Likes.io",
  description: "Get in touch with Likes.io. Our support team is available 24/7 to assist you with any questions, billing inquiries, or help you need.",
  alternates: {
    canonical: '/contact',
  },
};

export default function Page() {
  return (
    <>
      <Script id="livechat-widget" strategy="afterInteractive">
        {`
          window.__lc = window.__lc || {};
          window.__lc.license = 19456506;
          window.__lc.integration_name = "manual_onboarding";
          window.__lc.product_name = "livechat";
          (function(n, t, c) {
            function i(n) {
              return e._h ? e._h.apply(null, n) : e._q.push(n);
            }
            var e = {
              _q: [],
              _h: null,
              _v: "2.0",
              on: function() {
                i(["on", c.call(arguments)]);
              },
              once: function() {
                i(["once", c.call(arguments)]);
              },
              off: function() {
                i(["off", c.call(arguments)]);
              },
              get: function() {
                if (!e._h) {
                  throw new Error("[LiveChatWidget] You can't use getters before load.");
                }
                return i(["get", c.call(arguments)]);
              },
              call: function() {
                i(["call", c.call(arguments)]);
              },
              init: function() {
                var n = t.createElement("script");
                n.async = true;
                n.type = "text/javascript";
                n.src = "https://cdn.livechatinc.com/tracking.js";
                t.head.appendChild(n);
              }
            };
            if (!n.__lc.asyncInit) {
              e.init();
            }
            n.LiveChatWidget = n.LiveChatWidget || e;
          })(window, document, [].slice);
        `}
      </Script>
      <noscript>
        <a href="https://www.livechat.com/chat-with/19456506/" rel="nofollow">
          Chat with us
        </a>
        , powered by{" "}
        <a
          href="https://www.livechat.com/?welcome"
          rel="noopener nofollow"
          target="_blank"
        >
          LiveChat
        </a>
      </noscript>
      <Header />
      <ContactPage />
      <Footer />
    </>
  );
}

