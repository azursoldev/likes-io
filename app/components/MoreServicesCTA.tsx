"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEye } from "@fortawesome/free-regular-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useNavigation } from "@/app/hooks/useNavigation";

export type CTAButton = {
  href?: string;
  platform?: string;
  serviceType?: string;
  label: string;
  icon?: IconDefinition;
};

type MoreServicesCTAProps = {
  title?: string;
  highlight?: string;
  body?: string;
  buttons?: CTAButton[];
};

export default function MoreServicesCTA({
  title = "More Growth Services from Likes.io",
  highlight = "Services",
  body = "Instagram likes are powerful tools, but they're not the only engagements available from Likes.io. We offer more growth services that can rapidly boost your Instagram fan base or engagement rates even more. Please give them a try to see how quickly you can become popular and important on the app!",
  buttons,
}: MoreServicesCTAProps) {
  const { getLink } = useNavigation();

  const resolveHref = (btn: CTAButton) => {
    if (btn.href) return btn.href;
    if (btn.platform && btn.serviceType) return getLink(btn.platform, btn.serviceType);
    return "#";
  };

  const defaultButtons: CTAButton[] = [
    { platform: "instagram", serviceType: "followers", label: "BUY FOLLOWERS", icon: faUser },
    { platform: "instagram", serviceType: "views", label: "BUY VIEWS", icon: faEye },
  ];

  const displayButtons = buttons || defaultButtons;

  const renderTitle = () => {
    if (!highlight || !title.includes(highlight)) {
      return title;
    }
    const [before, ...rest] = title.split(highlight);
    const after = rest.join(highlight);
    return (
      <>
        {before}
        <span className="accent">{highlight}</span>
        {after}
      </>
    );
  };

  return (
    <section className="more-services">
      <div className="container">
        <div className="ms-header">
          <h2 className="ms-title">
            {renderTitle()}
          </h2>
          <p className="ms-sub">{body}</p>
        </div>

        <div className="ms-actions">
          {displayButtons.map((btn, index) => (
            <a href={resolveHref(btn)} className="ms-btn" key={index}>
            <span className="ms-icon">
                <FontAwesomeIcon icon={btn.icon ?? faUser} />
            </span>
              <span className="ms-label">{btn.label}</span>
            <span className="arrow" aria-hidden="true">
              <FontAwesomeIcon icon={faAngleRight} />
            </span>
          </a>
          ))}
        </div>
      </div>
    </section>
  );
}
