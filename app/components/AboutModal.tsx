"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type AboutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content?: string;
};

export default function AboutModal({ isOpen, onClose, content }: AboutModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">What is Likes.io?</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="modal-body">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <>
              <p>
                We are the leading marketplace for social media promotion. You can buy followers, likes, views, and a lot more for nearly all social media networks. We offer affordable prices without making any compromises in terms of the service quality.
              </p>
              <p>
                With over a million satisfied customers, including big-name artists, companies, and well-known influencers, Likes.io is the go-to platform for all your social media needs. Our services are 100% discreet and secure, with gradual and natural delivery to ensure your social media accounts are never at risk.
              </p>
              <h3>About Likes.io — The Market Leader for Over a Decade</h3>
              <p>
                With more than 10 million orders, Likes.io is one of the world's biggest social media stores. You can find everything on our website to improve your presence on major social media platforms like Instagram, YouTube, Facebook, etc. We offer different types of services for several social media platforms. Your wish is our command, and whatever your goal might be, Likes.io will help you achieve it. Whether you need more likes on your Instagram photos or want to make your LinkedIn profile more popular by getting additional followers, Likes.io is there to turn your goal into reality.
              </p>
              <p>
                Thanks to our effective services and our customer-oriented work, Likes.io has become a top player. You will not find a better service anywhere else, especially not at such affordable prices.
              </p>
              <h3>365 Days Per Year Customer Service</h3>
              <p>
                Your satisfaction is our motivation! We're not here just for the money; we do our work to help people find their road to social media success. And that's why our team will do all to make sure everything goes according to plan. If there's something wrong with your social media campaign, or worry that there might be some problems with your account, or want to learn more about how our services work, feel free to ping us. Our service staff is there for you seven days a week, ready to answer any of your questions. You can get in touch with us using the contact form on our website.
              </p>
              <h3>Buying Followers and Likes is Essential</h3>
              <p>
                Unless you're a major celebrity, you need some help with social media. The more followers you get on platforms like Instagram and Twitter, the more influential you get. Having the power to influence people's opinions is not only impressive but can also be very profitable. The bad news is that everyone wants to be famous and influential these days, but only a few can succeed. The good news is that you can be the chosen one who will get social media fame and everything that comes with it. But, for that, you need a little help from your friends from Likes.io.
              </p>
              <p>
                With our help, you will increase the number of followers on social media, which will have a domino effect and bring you even more new followers. Once people see that you got big followership, they will decide to give you a follow. "If a profile has so many followers, it means that it's interesting" – you can be sure this is going to be their reasoning. Furthermore, more followers mean a better ranking on search engines. And that means more potential customers/clients for your business. Finally, a large number of followers also do great for your credibility. Our social media services will help you to create a better overall picture of your brand.
              </p>
              <p>
                Let's be honest; a business with 30,000 followers is much more credible than one with 74 followers. And that's exactly what potential customers will pay attention to. A weak social media profile can be a real deal-breaker. At the same time, a fantastic social media profile can do wonders for your company. And Likes.io can make your social media profile amazing!
              </p>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

