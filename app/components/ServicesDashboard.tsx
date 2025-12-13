"use client";
import { useState, useEffect, useRef } from "react";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faTimes,
  faPencil,
  faTrash,
  faCheckCircle,
  faChevronDown,
  faInfoCircle,
  faLink,
  faPlus,
  faSearch,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

type Service = {
  id: number;
  name: string;
  platform: "instagram" | "tiktok" | "youtube";
  packages: number;
  active: boolean;
};

const services: Service[] = [
  { id: 1, name: "Instagram Likes", platform: "instagram", packages: 9, active: true },
  { id: 2, name: "Free Instagram Likes", platform: "instagram", packages: 0, active: true },
  { id: 3, name: "Free Instagram Followers", platform: "instagram", packages: 0, active: true },
  { id: 4, name: "Instagram Followers", platform: "instagram", packages: 7, active: true },
  { id: 5, name: "Instagram Views", platform: "instagram", packages: 9, active: true },
  { id: 6, name: "TikTok Likes", platform: "tiktok", packages: 7, active: true },
  { id: 7, name: "TikTok Followers", platform: "tiktok", packages: 7, active: true },
  { id: 8, name: "TikTok Views", platform: "tiktok", packages: 8, active: true },
  { id: 9, name: "YouTube Views", platform: "youtube", packages: 9, active: true },
  { id: 10, name: "YouTube Subscribers", platform: "youtube", packages: 9, active: true },
  { id: 11, name: "YouTube Likes", platform: "youtube", packages: 9, active: true },
];

const getPlatformIcon = (platform: string) => {
  if (platform === "instagram") return faInstagram;
  if (platform === "tiktok") return faTiktok;
  if (platform === "youtube") return faYoutube;
  return faInstagram;
};

export default function ServicesDashboard() {
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeSection, setActiveSection] = useState("configuration");
  const [showBenefitsForm, setShowBenefitsForm] = useState(false);
  const [steps, setSteps] = useState<Array<{ id: number; title: string; description: string; icon: string }>>([]);
  const [faqItems, setFaqItems] = useState<Array<{ id: number; question: string; answer: string }>>([]);
  const [highQualityPriceOptions, setHighQualityPriceOptions] = useState<Array<{ id: number; name: string; item: string; price1: string; price2: string; disc: string; serviceId: string }>>([]);
  const [premiumPriceOptions, setPremiumPriceOptions] = useState<Array<{ id: number; name: string; item: string; price1: string; price2: string; disc: string; serviceId: string }>>([]);
  const [highQualityFeatures, setHighQualityFeatures] = useState<Array<{ id: number; name: string }>>([]);
  const [premiumFeatures, setPremiumFeatures] = useState<Array<{ id: number; name: string }>>([]);
  
  const sectionRefs = {
    configuration: useRef<HTMLDivElement>(null),
    meta: useRef<HTMLDivElement>(null),
    benefits: useRef<HTMLDivElement>(null),
    pricing: useRef<HTMLDivElement>(null),
    howitworks: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
  };
  const contentRef = useRef<HTMLDivElement>(null);
  const editContentRef = useRef<HTMLDivElement>(null);
  
  const editSectionRefs = {
    configuration: useRef<HTMLDivElement>(null),
    meta: useRef<HTMLDivElement>(null),
    benefits: useRef<HTMLDivElement>(null),
    pricing: useRef<HTMLDivElement>(null),
    howitworks: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
  };

  const handleAddServiceClick = () => {
    setShowAddServiceModal(true);
  };

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setShowEditModal(true);
    setActiveSection("configuration");
  };

  const handleCloseModal = () => {
    setShowAddServiceModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedService(null);
  };

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log("Saving new service...");
    setShowAddServiceModal(false);
  };

  const handleSaveEditChanges = () => {
    // Handle save logic here
    console.log("Saving edited service...", selectedService);
    setShowEditModal(false);
    setSelectedService(null);
  };

  const handleNavClick = (sectionId: string) => {
    const refs = showEditModal ? editSectionRefs : sectionRefs;
    const section = refs[sectionId as keyof typeof refs]?.current;
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  const handleAddStep = () => {
    setSteps([...steps, { id: Date.now(), title: "", description: "", icon: "CheckCircle" }]);
  };

  const handleRemoveStep = (id: number) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const handleStepChange = (id: number, field: string, value: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const handleAddFaqItem = () => {
    setFaqItems([...faqItems, { id: Date.now(), question: "", answer: "" }]);
  };

  const handleRemoveFaqItem = (id: number) => {
    setFaqItems(faqItems.filter(item => item.id !== id));
  };

  const handleFaqChange = (id: number, field: string, value: string) => {
    setFaqItems(faqItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddPriceOption = (type: "highQuality" | "premium") => {
    const newOption = { id: Date.now(), name: "New", item: "", price1: "0", price2: "0", disc: "", serviceId: "" };
    if (type === "highQuality") {
      setHighQualityPriceOptions([...highQualityPriceOptions, newOption]);
    } else {
      setPremiumPriceOptions([...premiumPriceOptions, newOption]);
    }
  };

  const handleRemovePriceOption = (type: "highQuality" | "premium", id: number) => {
    if (type === "highQuality") {
      setHighQualityPriceOptions(highQualityPriceOptions.filter(opt => opt.id !== id));
    } else {
      setPremiumPriceOptions(premiumPriceOptions.filter(opt => opt.id !== id));
    }
  };

  const handlePriceOptionChange = (type: "highQuality" | "premium", id: number, field: string, value: string) => {
    if (type === "highQuality") {
      setHighQualityPriceOptions(highQualityPriceOptions.map(opt => 
        opt.id === id ? { ...opt, [field]: value } : opt
      ));
    } else {
      setPremiumPriceOptions(premiumPriceOptions.map(opt => 
        opt.id === id ? { ...opt, [field]: value } : opt
      ));
    }
  };

  const handleAddFeature = (type: "highQuality" | "premium") => {
    const newFeature = { id: Date.now(), name: "" };
    if (type === "highQuality") {
      setHighQualityFeatures([...highQualityFeatures, newFeature]);
    } else {
      setPremiumFeatures([...premiumFeatures, newFeature]);
    }
  };

  const handleRemoveFeature = (type: "highQuality" | "premium", id: number) => {
    if (type === "highQuality") {
      setHighQualityFeatures(highQualityFeatures.filter(feat => feat.id !== id));
    } else {
      setPremiumFeatures(premiumFeatures.filter(feat => feat.id !== id));
    }
  };

  const handleFeatureChange = (type: "highQuality" | "premium", id: number, value: string) => {
    if (type === "highQuality") {
      setHighQualityFeatures(highQualityFeatures.map(feat => 
        feat.id === id ? { ...feat, name: value } : feat
      ));
    } else {
      setPremiumFeatures(premiumFeatures.map(feat => 
        feat.id === id ? { ...feat, name: value } : feat
      ));
    }
  };

  useEffect(() => {
    if (!showAddServiceModal || !contentRef.current) return;

    const handleScroll = () => {
      const scrollPosition = contentRef.current!.scrollTop + 100;

      for (const [sectionId, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const contentElement = contentRef.current;
    contentElement.addEventListener("scroll", handleScroll);
    return () => contentElement.removeEventListener("scroll", handleScroll);
  }, [showAddServiceModal]);

  useEffect(() => {
    if (!showEditModal || !editContentRef.current) return;

    const handleScroll = () => {
      const scrollPosition = editContentRef.current!.scrollTop + 100;

      for (const [sectionId, ref] of Object.entries(editSectionRefs)) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const contentElement = editContentRef.current;
    contentElement.addEventListener("scroll", handleScroll);
    return () => contentElement.removeEventListener("scroll", handleScroll);
  }, [showEditModal]);

  const navSections = [
    { id: "configuration", label: "Configuration" },
    { id: "meta", label: "Meta & Hero" },
    { id: "benefits", label: "Benefits Section" },
    { id: "pricing", label: "Pricing Tiers" },
    { id: "howitworks", label: "How It Works" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="services" />

        <main className="admin-main">
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar-container">
              <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                  <h1>Services & Pricing</h1>
                </div>
                <div className="admin-toolbar-right">
                  <div className="admin-search-pill">
                    <span className="search-icon">🔍</span>
                    <input placeholder="Search..." aria-label="Search" />
                  </div>
                  <button className="admin-icon-btn" aria-label="Notifications">
                    <FontAwesomeIcon icon={faBell} />
                  </button>
                  <div className="admin-user-chip">
                    <div className="chip-avatar">AU</div>
                    <div className="chip-meta">
                      <span className="chip-name">Admin User</span>
                      <span className="chip-role">Administrator</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
         <div className="admin-content">
          <div className="services-hero">
            <div className="services-hero-left">
              <h1>Services & Pricing</h1>
              <p>Manage all products, packages, and their page content.</p>
            </div>
          </div>

          <div className="services-info-box">
            <FontAwesomeIcon icon={faInfoCircle} className="services-info-icon" />
            <div className="services-info-content">
              <h3 className="services-info-heading">How to Automate Orders</h3>
              <p>
                To automate order fulfillment, first configure your provider on the{" "}
                <a href="#" className="services-link">SMM Panel</a> page. Then, edit a service below and link each price package to its corresponding SMM Service ID.
              </p>
            </div>
          </div>
          <div className="services-header-actions">
            <button className="services-add-btn" onClick={handleAddServiceClick}>
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New Service</span>
            </button>
          </div>

       
          <div className="services-list">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-card-left">
                  <div className="service-icon-wrapper">
                    <FontAwesomeIcon icon={getPlatformIcon(service.platform)} className="service-platform-icon" />
                  </div>
                  <div className="service-info">
                    <h3 className="service-name">{service.name}</h3>
                    <p className="service-packages">
                      {service.packages} {service.packages === 1 ? "package" : "packages"} available
                    </p>
                  </div>
                </div>
                <div className="service-card-right">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={service.active} />
                    <span className="toggle-slider" />
                  </label>
                  <button className="service-edit-btn" onClick={() => handleEditClick(service)}>Edit Page Content</button>
                </div>
              </div>
            ))}
          </div>
          </div>
        </main>
      </div>

      {showAddServiceModal && (
        <div className="add-service-modal-overlay" onClick={handleCloseModal}>
          <div className="add-service-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-service-modal-header">
              <h2>Add New Service</h2>
              <button className="add-service-modal-close" onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="add-service-modal-body">
              <div className="add-service-sidebar">
                {navSections.map((section) => (
                  <button
                    key={section.id}
                    className={`add-service-nav-item ${activeSection === section.id ? "active" : ""}`}
                    onClick={() => handleNavClick(section.id)}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              <div className="add-service-content" ref={contentRef}>
                <div className="add-service-section" ref={sectionRefs.configuration}>
                  <h3 className="add-service-section-title">Service Configuration</h3>
                  <div className="add-service-form-group">
                    <label htmlFor="service-key">Service URL / Key (e.g., 'instagram-likes')</label>
                    <input
                      type="text"
                      id="service-key"
                      className="add-service-input"
                      placeholder="a-unique-service-key"
                    />
                    <p className="add-service-helper">This will be used in the URL. Must be unique, lowercase, with no spaces.</p>
                  </div>
                </div>

                <div className="add-service-section" ref={sectionRefs.meta}>
                  <h3 className="add-service-section-title">Meta & Hero</h3>
                  <div className="add-service-two-columns">
                    <div className="add-service-form-group">
                      <label htmlFor="meta-title">Meta Title</label>
                      <input
                        type="text"
                        id="meta-title"
                        className="add-service-input"
                        placeholder="New service page"
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="meta-description">Meta Description</label>
                      <input
                        type="text"
                        id="meta-description"
                        className="add-service-input"
                        placeholder="Description for new service"
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="hero-title">Hero Title</label>
                      <input
                        type="text"
                        id="hero-title"
                        className="add-service-input"
                        placeholder="New service title"
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="hero-subtitle">Hero Subtitle</label>
                      <div className="add-service-input-wrapper">
                        <input
                          type="text"
                          id="hero-subtitle"
                          className="add-service-input"
                          placeholder="New service subtitle"
                        />
                        <FontAwesomeIcon icon={faPencil} className="add-service-input-icon" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="add-service-section" ref={sectionRefs.benefits}>
                  <h3 className="add-service-section-title">Benefits Section</h3>
                  {!showBenefitsForm ? (
                    <button className="add-service-add-btn" onClick={() => setShowBenefitsForm(true)}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add Benefits Section</span>
                    </button>
                  ) : (
                    <div className="benefits-form-card">
                      <div className="add-service-two-columns">
                        <div className="add-service-form-group">
                          <label htmlFor="benefits-title">Section Title</label>
                          <input
                            type="text"
                            id="benefits-title"
                            className="add-service-input"
                            placeholder="Why Buying [Service] Is a Game-Changer"
                          />
                        </div>
                        <div className="add-service-form-group">
                          <label htmlFor="benefits-subtitle">Section Subtitle</label>
                          <textarea
                            id="benefits-subtitle"
                            className="add-service-textarea"
                            placeholder="A subtitle explaining the benefits."
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="add-service-form-group">
                        <label htmlFor="benefits-list">Benefits</label>
                        <button className="add-service-add-btn">
                          <FontAwesomeIcon icon={faPlus} />
                          <span>Add Benefit</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="add-service-section" ref={sectionRefs.pricing}>
                  <h3 className="add-service-section-title">Pricing Tiers</h3>
                  <div className="add-service-pricing-cards">
                    <div className="add-service-pricing-card">
                      <h4 className="pricing-card-title">High-Quality Packages</h4>
                      
                      <div className="price-options-list">
                        {highQualityPriceOptions.map((option) => (
                          <div key={option.id} className="price-option-form">
                            <div className="price-option-row">
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.name}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "name", e.target.value)}
                                placeholder="New"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.item}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "item", e.target.value)}
                                placeholder="Item:"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.price1}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "price1", e.target.value)}
                                placeholder="0"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.price2}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "price2", e.target.value)}
                                placeholder="0"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.disc}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "disc", e.target.value)}
                                placeholder="Disc"
                              />
                            </div>
                            <div className="smm-integration-row">
                              <FontAwesomeIcon icon={faLink} className="smm-link-icon" />
                              <span className="smm-integration-text">SMM Panel Integration</span>
                            </div>
                            <div className="service-id-row">
                              <input
                                type="text"
                                className="add-service-input service-id-input"
                                value={option.serviceId}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "serviceId", e.target.value)}
                                placeholder="Service ID"
                              />
                              <FontAwesomeIcon icon={faInfoCircle} className="service-id-info" />
                              <button
                                className="service-id-delete"
                                onClick={() => handleRemovePriceOption("highQuality", option.id)}
                                type="button"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddPriceOption("highQuality")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Price Option</span>
                      </button>
                      
                      <h5 className="pricing-card-subtitle">Features</h5>
                      
                      <div className="features-list">
                        {highQualityFeatures.map((feature) => (
                          <div key={feature.id} className="feature-input-row">
                            <input
                              type="text"
                              className="add-service-input feature-input"
                              value={feature.name}
                              onChange={(e) => handleFeatureChange("highQuality", feature.id, e.target.value)}
                              placeholder="New Feature"
                            />
                            <button
                              className="feature-delete-btn"
                              onClick={() => handleRemoveFeature("highQuality", feature.id)}
                              type="button"
                            >
                              Del
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddFeature("highQuality")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Feature</span>
                      </button>
                    </div>
                    
                    <div className="add-service-pricing-card">
                      <h4 className="pricing-card-title">Premium Packages</h4>
                      
                      <div className="price-options-list">
                        {premiumPriceOptions.map((option) => (
                          <div key={option.id} className="price-option-form">
                            <div className="price-option-row">
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.name}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "name", e.target.value)}
                                placeholder="New"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.item}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "item", e.target.value)}
                                placeholder="Item:"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.price1}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "price1", e.target.value)}
                                placeholder="0"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.price2}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "price2", e.target.value)}
                                placeholder="0"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.disc}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "disc", e.target.value)}
                                placeholder="Disc"
                              />
                            </div>
                            <div className="smm-integration-row">
                              <FontAwesomeIcon icon={faLink} className="smm-link-icon" />
                              <span className="smm-integration-text">SMM Panel Integration</span>
                            </div>
                            <div className="service-id-row">
                              <input
                                type="text"
                                className="add-service-input service-id-input"
                                value={option.serviceId}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "serviceId", e.target.value)}
                                placeholder="Service ID"
                              />
                              <FontAwesomeIcon icon={faInfoCircle} className="service-id-info" />
                              <button
                                className="service-id-delete"
                                onClick={() => handleRemovePriceOption("premium", option.id)}
                                type="button"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddPriceOption("premium")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Price Option</span>
                      </button>
                      
                      <h5 className="pricing-card-subtitle">Features</h5>
                      
                      <div className="features-list">
                        {premiumFeatures.map((feature) => (
                          <div key={feature.id} className="feature-input-row">
                            <input
                              type="text"
                              className="add-service-input feature-input"
                              value={feature.name}
                              onChange={(e) => handleFeatureChange("premium", feature.id, e.target.value)}
                              placeholder="New Feature"
                            />
                            <button
                              className="feature-delete-btn"
                              onClick={() => handleRemoveFeature("premium", feature.id)}
                              type="button"
                            >
                              Del
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddFeature("premium")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Feature</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="add-service-section" ref={sectionRefs.howitworks}>
                  <h3 className="add-service-section-title">How It Works Section</h3>
                  <div className="howitworks-form-card">
                    <div className="add-service-two-columns">
                      <div className="add-service-form-group">
                        <label htmlFor="howitworks-title">Section Title</label>
                        <input
                          type="text"
                          id="howitworks-title"
                          className="add-service-input"
                          placeholder="Section Title"
                          defaultValue="How It Works"
                        />
                      </div>
                      <div className="add-service-form-group">
                        <label htmlFor="howitworks-subtitle">Section Subtitle</label>
                        <input
                          type="text"
                          id="howitworks-subtitle"
                          className="add-service-input"
                          placeholder="Section Subtitle"
                          defaultValue="A simple process."
                        />
                      </div>
                    </div>
                    <div className="steps-list">
                      {steps.map((step) => (
                        <div key={step.id} className="step-row">
                          <div className="step-input-group">
                            <input
                              type="text"
                              className="add-service-input step-input"
                              placeholder="Step Title"
                              value={step.title}
                              onChange={(e) => handleStepChange(step.id, "title", e.target.value)}
                            />
                          </div>
                          <div className="step-input-group">
                            <input
                              type="text"
                              className="add-service-input step-input"
                              placeholder="Step Description"
                              value={step.description}
                              onChange={(e) => handleStepChange(step.id, "description", e.target.value)}
                            />
                          </div>
                          <div className="step-icon-select-wrapper">
                            <select
                              className="add-service-input step-icon-select"
                              value={step.icon}
                              onChange={(e) => handleStepChange(step.id, "icon", e.target.value)}
                            >
                              <option value="CheckCircle">CheckCircle</option>
                              <option value="User">User</option>
                              <option value="Star">Star</option>
                              <option value="Heart">Heart</option>
                            </select>
                            <FontAwesomeIcon icon={faChevronDown} className="step-select-arrow" />
                          </div>
                          <button
                            className="step-delete-btn"
                            onClick={() => handleRemoveStep(step.id)}
                            type="button"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="add-service-add-btn" onClick={handleAddStep}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add Step</span>
                    </button>
                  </div>
                </div>

                <div className="add-service-section" ref={sectionRefs.faq}>
                  <h3 className="add-service-section-title">FAQ Section</h3>
                  <div className="faq-form-card">
                    <div className="faq-items-list">
                      {faqItems.map((item) => (
                        <div key={item.id} className="faq-item-row">
                          <div className="faq-input-group">
                            <input
                              type="text"
                              className="add-service-input faq-input"
                              placeholder="Question"
                              value={item.question}
                              onChange={(e) => handleFaqChange(item.id, "question", e.target.value)}
                            />
                          </div>
                          <div className="faq-input-group">
                            <textarea
                              className="add-service-textarea faq-textarea"
                              placeholder="Answer"
                              rows={3}
                              value={item.answer}
                              onChange={(e) => handleFaqChange(item.id, "answer", e.target.value)}
                            />
                          </div>
                          <button
                            className="faq-delete-btn"
                            onClick={() => handleRemoveFaqItem(item.id)}
                            type="button"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="add-service-add-btn" onClick={handleAddFaqItem}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add FAQ Item</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="add-service-modal-footer">
              <button className="add-service-btn cancel" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="add-service-btn save" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedService && (
        <div className="add-service-modal-overlay" onClick={handleCloseEditModal}>
          <div className="add-service-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-service-modal-header">
              <h2>Editing: {selectedService.name}</h2>
              <button className="add-service-modal-close" onClick={handleCloseEditModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="add-service-modal-body">
              <div className="add-service-sidebar">
                {navSections.map((section) => (
                  <button
                    key={section.id}
                    className={`add-service-nav-item ${activeSection === section.id ? "active" : ""}`}
                    onClick={() => handleNavClick(section.id)}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              <div className="add-service-content" ref={editContentRef}>
                <div className="add-service-section" ref={editSectionRefs.configuration}>
                  <h3 className="add-service-section-title">Service Configuration</h3>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-service-key">Service URL / Key (e.g., 'instagram-likes')</label>
                    <input
                      type="text"
                      id="edit-service-key"
                      className="add-service-input"
                      placeholder="a-unique-service-key"
                      defaultValue={selectedService.name.toLowerCase().replace(/\s+/g, '-')}
                    />
                    <p className="add-service-helper">This will be used in the URL. Must be unique, lowercase, with no spaces.</p>
                  </div>
                </div>

                <div className="add-service-section" ref={editSectionRefs.meta}>
                  <h3 className="add-service-section-title">Meta & Hero</h3>
                  <div className="add-service-two-columns">
                    <div className="add-service-form-group">
                      <label htmlFor="edit-meta-title">Meta Title</label>
                      <input
                        type="text"
                        id="edit-meta-title"
                        className="add-service-input"
                        placeholder="New service page"
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="edit-meta-description">Meta Description</label>
                      <input
                        type="text"
                        id="edit-meta-description"
                        className="add-service-input"
                        placeholder="Description for new service"
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="edit-hero-title">Hero Title</label>
                      <input
                        type="text"
                        id="edit-hero-title"
                        className="add-service-input"
                        placeholder="New service title"
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="edit-hero-subtitle">Hero Subtitle</label>
                      <div className="add-service-input-wrapper">
                        <input
                          type="text"
                          id="edit-hero-subtitle"
                          className="add-service-input"
                          placeholder="New service subtitle"
                        />
                        <FontAwesomeIcon icon={faPencil} className="add-service-input-icon" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="add-service-section" ref={editSectionRefs.benefits}>
                  <h3 className="add-service-section-title">Benefits Section</h3>
                  {!showBenefitsForm ? (
                    <button className="add-service-add-btn" onClick={() => setShowBenefitsForm(true)}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add Benefits Section</span>
                    </button>
                  ) : (
                    <div className="benefits-form-card">
                      <div className="add-service-two-columns">
                        <div className="add-service-form-group">
                          <label htmlFor="edit-benefits-title">Section Title</label>
                          <input
                            type="text"
                            id="edit-benefits-title"
                            className="add-service-input"
                            placeholder="Why Buying [Service] Is a Game-Changer"
                          />
                        </div>
                        <div className="add-service-form-group">
                          <label htmlFor="edit-benefits-subtitle">Section Subtitle</label>
                          <textarea
                            id="edit-benefits-subtitle"
                            className="add-service-textarea"
                            placeholder="A subtitle explaining the benefits."
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="add-service-form-group">
                        <label htmlFor="edit-benefits-list">Benefits</label>
                        <button className="add-service-add-btn">
                          <FontAwesomeIcon icon={faPlus} />
                          <span>Add Benefit</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="add-service-section" ref={editSectionRefs.pricing}>
                  <h3 className="add-service-section-title">Pricing Tiers</h3>
                  <div className="add-service-pricing-cards">
                    <div className="add-service-pricing-card">
                      <h4 className="pricing-card-title">High-Quality Packages</h4>
                      
                      <div className="price-options-list">
                        {highQualityPriceOptions.map((option) => (
                          <div key={option.id} className="price-option-form">
                            <div className="price-option-row">
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.name}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "name", e.target.value)}
                                placeholder="New"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.item}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "item", e.target.value)}
                                placeholder="Item:"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.price1}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "price1", e.target.value)}
                                placeholder="0"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.price2}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "price2", e.target.value)}
                                placeholder="0"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.disc}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "disc", e.target.value)}
                                placeholder="Disc"
                              />
                            </div>
                            <div className="smm-integration-row">
                              <FontAwesomeIcon icon={faLink} className="smm-link-icon" />
                              <span className="smm-integration-text">SMM Panel Integration</span>
                            </div>
                            <div className="service-id-row">
                              <input
                                type="text"
                                className="add-service-input service-id-input"
                                value={option.serviceId}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "serviceId", e.target.value)}
                                placeholder="Service ID"
                              />
                              <FontAwesomeIcon icon={faInfoCircle} className="service-id-info" />
                              <button
                                className="service-id-delete"
                                onClick={() => handleRemovePriceOption("highQuality", option.id)}
                                type="button"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddPriceOption("highQuality")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Price Option</span>
                      </button>
                      
                      <h5 className="pricing-card-subtitle">Features</h5>
                      
                      <div className="features-list">
                        {highQualityFeatures.map((feature) => (
                          <div key={feature.id} className="feature-input-row">
                            <input
                              type="text"
                              className="add-service-input feature-input"
                              value={feature.name}
                              onChange={(e) => handleFeatureChange("highQuality", feature.id, e.target.value)}
                              placeholder="New Feature"
                            />
                            <button
                              className="feature-delete-btn"
                              onClick={() => handleRemoveFeature("highQuality", feature.id)}
                              type="button"
                            >
                              Del
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddFeature("highQuality")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Feature</span>
                      </button>
                    </div>
                    
                    <div className="add-service-pricing-card">
                      <h4 className="pricing-card-title">Premium Packages</h4>
                      
                      <div className="price-options-list">
                        {premiumPriceOptions.map((option) => (
                          <div key={option.id} className="price-option-form">
                            <div className="price-option-row">
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.name}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "name", e.target.value)}
                                placeholder="New"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.item}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "item", e.target.value)}
                                placeholder="Item:"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.price1}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "price1", e.target.value)}
                                placeholder="0"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.price2}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "price2", e.target.value)}
                                placeholder="0"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.disc}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "disc", e.target.value)}
                                placeholder="Disc"
                              />
                            </div>
                            <div className="smm-integration-row">
                              <FontAwesomeIcon icon={faLink} className="smm-link-icon" />
                              <span className="smm-integration-text">SMM Panel Integration</span>
                            </div>
                            <div className="service-id-row">
                              <input
                                type="text"
                                className="add-service-input service-id-input"
                                value={option.serviceId}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "serviceId", e.target.value)}
                                placeholder="Service ID"
                              />
                              <FontAwesomeIcon icon={faInfoCircle} className="service-id-info" />
                              <button
                                className="service-id-delete"
                                onClick={() => handleRemovePriceOption("premium", option.id)}
                                type="button"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddPriceOption("premium")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Price Option</span>
                      </button>
                      
                      <h5 className="pricing-card-subtitle">Features</h5>
                      
                      <div className="features-list">
                        {premiumFeatures.map((feature) => (
                          <div key={feature.id} className="feature-input-row">
                            <input
                              type="text"
                              className="add-service-input feature-input"
                              value={feature.name}
                              onChange={(e) => handleFeatureChange("premium", feature.id, e.target.value)}
                              placeholder="New Feature"
                            />
                            <button
                              className="feature-delete-btn"
                              onClick={() => handleRemoveFeature("premium", feature.id)}
                              type="button"
                            >
                              Del
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddFeature("premium")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Feature</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="add-service-section" ref={editSectionRefs.howitworks}>
                  <h3 className="add-service-section-title">How It Works</h3>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-howitworks-title">Section Title</label>
                    <input
                      type="text"
                      id="edit-howitworks-title"
                      className="add-service-input"
                      placeholder="Section Title"
                      defaultValue="How It Works"
                    />
                  </div>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-howitworks-subtitle">Section Subtitle</label>
                    <input
                      type="text"
                      id="edit-howitworks-subtitle"
                      className="add-service-input"
                      placeholder="Section Subtitle"
                    />
                  </div>
                  <div className="add-service-form-group">
                    <label>Steps</label>
                    {steps.map((step) => (
                      <div key={step.id} className="add-service-step-card">
                        <div className="add-service-step-row">
                          <input
                            type="text"
                            className="add-service-input"
                            placeholder="Step Title"
                            value={step.title}
                            onChange={(e) => handleStepChange(step.id, "title", e.target.value)}
                          />
                          <textarea
                            className="add-service-textarea"
                            placeholder="Step Description"
                            rows={2}
                            value={step.description}
                            onChange={(e) => handleStepChange(step.id, "description", e.target.value)}
                          />
                          <select
                            className="add-service-step-icon-dropdown"
                            value={step.icon}
                            onChange={(e) => handleStepChange(step.id, "icon", e.target.value)}
                          >
                            <option value="CheckCircle">Check Circle</option>
                            <option value="User">User</option>
                            <option value="Star">Star</option>
                          </select>
                          <button
                            className="step-delete-btn"
                            onClick={() => handleRemoveStep(step.id)}
                            type="button"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="add-service-add-btn" onClick={handleAddStep}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add Step</span>
                    </button>
                  </div>
                </div>

                <div className="add-service-section" ref={editSectionRefs.faq}>
                  <h3 className="add-service-section-title">FAQ Section</h3>
                  <div className="faq-form-card">
                    <div className="faq-items-list">
                      {faqItems.map((item) => (
                        <div key={item.id} className="faq-item-row">
                          <div className="faq-input-group">
                            <input
                              type="text"
                              className="add-service-input faq-input"
                              placeholder="Question"
                              value={item.question}
                              onChange={(e) => handleFaqChange(item.id, "question", e.target.value)}
                            />
                          </div>
                          <div className="faq-input-group">
                            <textarea
                              className="add-service-textarea faq-textarea"
                              placeholder="Answer"
                              rows={3}
                              value={item.answer}
                              onChange={(e) => handleFaqChange(item.id, "answer", e.target.value)}
                            />
                          </div>
                          <button
                            className="faq-delete-btn"
                            onClick={() => handleRemoveFaqItem(item.id)}
                            type="button"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="add-service-add-btn" onClick={handleAddFaqItem}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add FAQ Item</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="add-service-modal-footer">
              <button className="add-service-btn cancel" onClick={handleCloseEditModal}>
                Cancel
              </button>
              <button className="add-service-btn save" onClick={handleSaveEditChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
