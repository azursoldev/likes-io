"use client";

import { useState } from "react";
import LearnMoreLink from "./LearnMoreLink";
import AboutModal from "./AboutModal";

type LearnMoreSectionProps = {
  text: string;
  modalContent?: string;
};

export default function LearnMoreSection({ text, modalContent }: LearnMoreSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <LearnMoreLink text={text} onLearnMoreClick={() => setIsModalOpen(true)} />
      <AboutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={modalContent} />
    </>
  );
}

