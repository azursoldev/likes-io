"use client";

type LearnMoreLinkProps = {
  text: string;
  onLearnMoreClick?: () => void;
};

export default function LearnMoreLink({ text, onLearnMoreClick }: LearnMoreLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onLearnMoreClick) {
      onLearnMoreClick();
    }
  };

  return (
    <section className="learn-more-section">
      <div className="container">
        <div className="learn-more-divider"></div>
        <div className="learn-more-link-wrapper">
          <a href="#" className="learn-more-link" onClick={handleClick}>
            {text}
          </a>
        </div>
      </div>
    </section>
  );
}

