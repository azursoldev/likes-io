type AssuranceCardProps = {
  text?: string;
};

const DEFAULT_TEXT = "Join over a million satisfied customers, including artists, companies, and top influencers. Our services are <b>100% discreet, secure, and delivered naturally</b> to ensure your account is always safe.";

export default function AssuranceCard({ text }: AssuranceCardProps) {
  const displayText = text || DEFAULT_TEXT;
  
  return (
    <section className="assurance">
      <div className="container">
        <div className="assurance-card">
          <div className="assurance-icon" aria-hidden>
            <img src="/secure-2.svg" alt="Secure" width={28} height={28} />
          </div>
          <p className="assurance-text" dangerouslySetInnerHTML={{ __html: displayText }} />
        </div> 
      </div>
    </section>
  );
}
