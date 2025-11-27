import { Fragment } from "react";
type Step = {
  title: string;
  description: string;
};

type HowItWorksSectionProps = {
  title?: string;
  subtitle?: string;
  steps?: Step[];
};

const DEFAULT_STEPS: Step[] = [
  {
    title: "1. Select Your Package",
    description: "Choose from our High-Quality or Premium likes and select the quantity that matches your goals.",
  },
  {
    title: "2. Provide Your Post(s)",
    description: "Enter your username and select the posts you want to boost. No password required, ever.",
  },
  {
    title: "3. Watch the Magic Happen",
    description: "Complete the secure checkout and watch as real likes start appearing on your posts within minutes.",
  },
];

export default function HowItWorksSection({
  title = "How It Works",
  subtitle = "Our streamlined process is designed for speed and security. Give your posts the engagement they deserve right now.",
  steps = DEFAULT_STEPS,
}: HowItWorksSectionProps) {
  return (
    <section className="howitworks">
      <div className="container">
        <div className="hw-header">
          <h2 className="hw-title">{title}</h2>
          <p className="hw-sub">{subtitle}</p>
        </div>

        <div className="hw-steps" role="list">
          {steps.map((step, idx) => (
            <Fragment key={step.title}>
              <div className="hw-step" role="listitem">
                <div className="hw-num" aria-hidden="true">
                  {idx + 1}
                </div>
                <h3 className="hw-step-title">{step.title}</h3>
                <p className="hw-step-desc">{step.description}</p>
              </div>
              {idx < steps.length - 1 && <span className="hw-sep" aria-hidden="true"></span>}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
