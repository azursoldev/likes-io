"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faRocket, 
  faAward, 
  faShieldHalved, 
  faHeadset, 
  faStar, 
  faCheckCircle,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";

interface BenefitItem {
  icon: string;
  title: string;
  desc: string;
}

interface AdvantageSectionProps {
  title?: string;
  subtitle?: string;
  items?: BenefitItem[];
  fetchHomepageData?: boolean;
}

const ICON_MAPPING: Record<string, IconDefinition> = {
  RocketLaunchIcon: faRocket,
  AwardIcon: faAward,
  ShieldCheckIcon: faShieldHalved,
  HeadsetIcon: faHeadset,
  StarIcon: faStar,
  CheckCircleIcon: faCheckCircle,
};

export default function AdvantageSection({ title, subtitle, items, fetchHomepageData = false }: AdvantageSectionProps) {
  const [content, setContent] = useState<{
    title: string;
    subtitle: string;
    items: BenefitItem[];
  } | null>(null);

  useEffect(() => {
    if (!fetchHomepageData) return;

    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/cms/homepage?t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          if (data.content) {
            const benefits = data.content.benefits || [];
            const mappedItems = benefits.map((b: any) => ({
              icon: b.icon,
              title: b.title,
              desc: b.description || b.desc,
            }));

            setContent({
              title: data.content.whyChooseTitle,
              subtitle: data.content.whyChooseSubtitle,
              items: mappedItems.length > 0 ? mappedItems : null,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch homepage content:", error);
      }
    };

    fetchContent();
  }, []);

  const displayItems = content?.items || items || [];
  const displayTitle = content?.title || title || "";
  const displaySubtitle = content?.subtitle || subtitle || "";

  if (!displayTitle && displayItems.length === 0) return null;

  const renderIcon = (iconStr: string) => {
    // Check if it's a mapped FontAwesome icon
    if (ICON_MAPPING[iconStr]) {
      return (
        <FontAwesomeIcon 
          icon={ICON_MAPPING[iconStr]} 
          style={{ width: '28px', height: '28px', color: '#f97316' }} 
        />
      );
    }
    
    // Fallback to image if it's a path or not in mapping
    // If it's a heroicon name but not in our mapping, we might want a default or try to match?
    // For now, assume paths start with / or are filenames
    return <img src={iconStr} alt="" style={{ width: '28px', height: '28px' }} />;
  };

  return (
    <section className="advantage">
      <div className="container">
        <h2 className="adv-title" dangerouslySetInnerHTML={{ __html: displayTitle }} />
        <p className="adv-sub">{displaySubtitle}</p>

        <div className="adv-grid">
          {displayItems.map((it, idx) => (
            <div className="adv-card" key={idx}>
              <div className="adv-icon">
                {renderIcon(it.icon)}
              </div>
              <div className="adv-card-title">{it.title}</div>
              <div className="adv-card-desc">{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
