"use client";

import { useState } from "react";
import LearnMoreLink from "./LearnMoreLink";
import AboutModal from "./AboutModal";

type LearnMoreSectionProps = {
  text: string;
};

export default function LearnMoreSection({ text }: LearnMoreSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <LearnMoreLink text={text} onLearnMoreClick={() => setIsModalOpen(true)} />
      <AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

