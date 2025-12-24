"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState, useEffect } from "react";

type PageLink = {
  pagePath: string;
  link: string;
  nofollow: boolean;
};

type FeaturedItem = {
  id: number;
  brandName: string;
  logoUrl: string | null;
  altText: string | null;
  pageLinks: PageLink[];
  displayOrder: number;
  isActive: boolean;
};

import { useNavigation } from "../hooks/useNavigation";

const DEFAULT_BRANDS = [
  { brandName: "Forbes", pageLinks: [{ pagePath: "all", link: "/", nofollow: false }], displayOrder: 0 },
  { brandName: "Business Insider", pageLinks: [{ pagePath: "all", link: "/", nofollow: false }], displayOrder: 1 },
  { brandName: "Entrepreneur", pageLinks: [{ pagePath: "all", link: "/", nofollow: false }], displayOrder: 2 },
  { brandName: "WIRED", pageLinks: [{ pagePath: "all", link: "/", nofollow: false }], displayOrder: 3 },
];

export default function FeaturedOnDashboard() {
  const { getLink } = useNavigation();

  const pageOptions = useMemo(() => [
    { value: "all", label: "All Pages" },
    { value: "/", label: "Homepage" },
    { value: getLink("instagram", "likes"), label: "Instagram Likes" },
    { value: "/free-instagram-likes", label: "Free Instagram Likes" },
    { value: "/free-instagram-followers", label: "Free Instagram Followers" },
    { value: getLink("instagram", "followers"), label: "Instagram Followers" },
    { value: getLink("instagram", "views"), label: "Instagram Views" },
    { value: getLink("tiktok", "likes"), label: "TikTok Likes" },
    { value: getLink("tiktok", "followers"), label: "TikTok Followers" },
    { value: getLink("tiktok", "views"), label: "TikTok Views" },
    { value: getLink("youtube", "views"), label: "YouTube Views" },
    { value: getLink("youtube", "subscribers"), label: "YouTube Subscribers" },
    { value: getLink("youtube", "likes"), label: "YouTube Likes" },
  ], [getLink]);

  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [type, setType] = useState<"text" | "image">("text");
  const [brandName, setBrandName] = useState("");
  const [altText, setAltText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [pageLinks, setPageLinks] = useState<PageLink[]>([{ pagePath: "all", link: "#", nofollow: false }]);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [logoImageName, setLogoImageName] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  // Fetch brands from API
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async (skipAutoSeed = false) => {
    try {
      setLoading(true);
      const response = await fetch("/api/cms/featured-on");
      if (response.ok) {
        const data = await response.json();
        const brands = (data.brands || []).map((brand: any) => {
          // Ensure pageLinks is always an array with proper structure
          const pageLinks = (brand.pageLinks || []).map((link: any) => ({
            pagePath: link.pagePath || "all",
            link: link.link || "#",
            nofollow: link.nofollow || false,
          }));
          
          return {
            ...brand,
            pageLinks: pageLinks,
          };
        });
        
        console.log('Fetched brands with pageLinks:', brands.map((b: any) => ({
          id: b.id,
          brandName: b.brandName,
          pageLinksCount: b.pageLinks.length,
          pageLinks: b.pageLinks,
        })));
        
        setItems(brands);
        
        // Auto-seed default brands if database is empty
        if (!skipAutoSeed && brands.length === 0) {
          await seedDefaultBrands(true);
        }
      } else {
        console.error("Failed to fetch brands");
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  // Seed default brands if database is empty
  const seedDefaultBrands = async (skipFetch = false) => {
    try {
      setSaving(true);
      for (const brand of DEFAULT_BRANDS) {
        await fetch("/api/cms/featured-on", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(brand),
        });
      }
      if (!skipFetch) {
        await fetchBrands(true);
      } else {
        // Fetch after seeding
        const response = await fetch("/api/cms/featured-on");
        if (response.ok) {
          const data = await response.json();
          const brands = (data.brands || []).map((brand: any) => ({
            ...brand,
            pageLinks: brand.pageLinks || [],
          }));
          setItems(brands);
        }
      }
    } catch (error) {
      console.error("Error seeding default brands:", error);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setType("text");
    setBrandName("");
    setAltText("");
    setLogoUrl("");
    setPageLinks([{ pagePath: "all", link: "#", nofollow: false }]);
    setDisplayOrder(0);
    setLogoImage(null);
    setLogoImageName("");
    setEditingId(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleStartEdit = (item: FeaturedItem) => {
    console.log('=== Editing item ===');
    console.log('Full item:', JSON.stringify(item, null, 2));
    console.log('Item pageLinks:', item.pageLinks);
    console.log('Item pageLinks type:', typeof item.pageLinks, Array.isArray(item.pageLinks));
    console.log('Item pageLinks length:', item.pageLinks?.length);
    
    setEditingId(item.id);
    setBrandName(item.brandName);
    setAltText(item.altText || "");
    setLogoUrl(item.logoUrl || "");
    setType(item.logoUrl ? "image" : "text");
    setDisplayOrder(item.displayOrder);
    
    // Ensure pageLinks is an array and has the correct structure
    let validPageLinks: PageLink[] = [];
    
    if (item.pageLinks && Array.isArray(item.pageLinks) && item.pageLinks.length > 0) {
      validPageLinks = item.pageLinks.map((link: any) => {
        const mappedLink = {
          pagePath: String(link.pagePath || "all"),
          link: String(link.link || "#"),
          nofollow: Boolean(link.nofollow !== undefined ? link.nofollow : false),
        };
        console.log('Mapped link:', mappedLink);
        return mappedLink;
      });
      console.log('Final validPageLinks:', validPageLinks);
    } else {
      // If no pageLinks, create a default one
      validPageLinks = [{ pagePath: "all", link: "#", nofollow: false }];
      console.log('No pageLinks found, using default:', validPageLinks);
    }
    
    setPageLinks(validPageLinks);
    console.log('Set pageLinks state to:', validPageLinks);
    setLogoImageName(item.logoUrl ? "Current logo" : "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!brandName.trim()) {
      alert("Brand name is required");
      return;
    }

    if (type === "image" && !logoUrl && !logoImage) {
      alert("Please provide a logo URL or upload an image");
      return;
    }

    if (pageLinks.length === 0) {
      alert("At least one page link is required");
      return;
    }

    try {
      setSaving(true);
      
      // Ensure pageLinks have the correct structure
      const validPageLinks = pageLinks.map(link => ({
        pagePath: link.pagePath || "all",
        link: link.link || "#",
        nofollow: link.nofollow || false,
      }));
      
      console.log('Saving brand with pageLinks:', {
        brandName: brandName.trim(),
        pageLinksCount: validPageLinks.length,
        pageLinks: validPageLinks,
      });
      
      const brandData: any = {
        brandName: brandName.trim(),
        altText: type === "image" ? (altText.trim() || brandName.trim()) : null,
        logoUrl: type === "image" ? (logoUrl || (logoImage ? "uploaded" : null)) : null,
        pageLinks: validPageLinks,
        displayOrder: displayOrder,
        isActive: true,
      };
      
      console.log('Brand data being sent:', JSON.stringify(brandData, null, 2));

      if (editingId !== null) {
        // Update existing brand
        const response = await fetch("/api/cms/featured-on", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...brandData }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update brand");
        }
      } else {
        // Create new brand
        const response = await fetch("/api/cms/featured-on", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(brandData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create brand");
        }
      }

      resetForm();
      setShowModal(false);
      await fetchBrands(true);
    } catch (error: any) {
      console.error("Error saving brand:", error);
      alert(error.message || "Failed to save brand");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this brand?")) return;

    try {
      const response = await fetch(`/api/cms/featured-on?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete brand");
      }

      await fetchBrands(true);
    } catch (error: any) {
      console.error("Error deleting brand:", error);
      alert(error.message || "Failed to delete brand");
    }
  };

  const handleAddPageLink = () => {
    setPageLinks([...pageLinks, { pagePath: "all", link: "#", nofollow: false }]);
  };

  const handleUpdatePageLink = (index: number, field: keyof PageLink, value: string | boolean) => {
    setPageLinks(prev => prev.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    ));
  };

  const handleRemovePageLink = (index: number) => {
    if (pageLinks.length > 1) {
      setPageLinks(prev => prev.filter((_, i) => i !== index));
    } else {
      alert("At least one page link is required");
    }
  };

  if (loading) {
    return (
      <div className="admin-wrapper">
        <PromoBar />
        <div className="admin-body">
          <AdminSidebar activePage="featuredOn" />
          <main className="admin-main">
            <AdminToolbar title="Featured On" />
            <div className="featured-page">
              <div style={{ padding: "24px", textAlign: "center" }}>Loading...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="featuredOn" />
        <main className="admin-main">
          <AdminToolbar title="Featured On" />
          <div className="featured-page">
            <div className="featured-header">
              <div>
                <h2>As Featured On</h2>
                <p>Manage the brands displayed in the 'As Featured On' section.</p>
              </div>
              <button className="featured-add-btn" onClick={handleStartAdd}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Brand</span>
              </button>
            </div>

            <div className="featured-card">
              <table className="featured-table">
                <thead>
                  <tr>
                    <th>Brand Name</th>
                    <th>Type</th>
                    <th>Page Links</th>
                    <th>Order</th>
                    <th className="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
                        No brands added yet. Click "Add Brand" to get started.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id}>
                        <td className="featured-preview">{item.brandName}</td>
                        <td>
                          <span className="type-pill">{item.logoUrl ? "Image" : "Text"}</span>
                        </td>
                        <td>
                          {item.pageLinks.length > 0 
                            ? `${item.pageLinks.length} page(s)` 
                            : <span style={{ color: "#6b7280" }}>—</span>}
                        </td>
                        <td>{item.displayOrder}</td>
                        <td className="actions-cell">
                          <button className="link-btn" onClick={() => handleStartEdit(item)}>
                            Edit
                          </button>
                          <button className="link-btn danger" onClick={() => handleDelete(item.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="faq-modal-backdrop">
          <div className="faq-modal featured-modal">
            <div className="faq-modal-header">
              <h3>{isEditing ? "Edit Item" : "Add New Item"}</h3>
              <button
                className="faq-modal-close"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="faq-modal-body">
              {/* Type Tabs */}
              <label className="faq-modal-label">
                Type
                <div className="type-tab-group">
                  <button
                    type="button"
                    className={`type-tab ${type === "text" ? "type-tab-active" : ""}`}
                    onClick={() => setType("text")}
                  >
                    Text
                  </button>
                  <button
                    type="button"
                    className={`type-tab ${type === "image" ? "type-tab-active" : ""}`}
                    onClick={() => setType("image")}
                  >
                    Image
                  </button>
                </div>
              </label>

              {type === "text" ? (
                <label className="faq-modal-label">
                  Brand Name *
                  <input
                    className="faq-modal-input featured-dark-input"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g., Forbes"
                  />
                </label>
              ) : (
                <>
                  <label className="faq-modal-label">
                    Logo Image
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <label
                        htmlFor="logo-upload"
                        style={{
                          padding: "8px 16px",
                          background: "#f97316",
                          color: "#fff",
                          border: "1px solid #f97316",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Choose File
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLogoImage(file);
                            setLogoImageName(file.name);
                            // For now, we'll use the file name as a placeholder
                            // In production, you'd upload to a storage service
                          }
                        }}
                      />
                      <input
                        type="text"
                        readOnly
                        value={logoImageName || "No file chosen"}
                        className="faq-modal-input featured-dark-input"
                        style={{ flex: 1, cursor: "default" }}
                      />
                    </div>
                    <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                      Or enter a logo URL below
                    </p>
                  </label>
                  <label className="faq-modal-label">
                    Logo URL
                    <input
                      className="faq-modal-input featured-dark-input"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </label>
                  <label className="faq-modal-label">
                    Alt Text
                    <input
                      className="faq-modal-input featured-dark-input"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="e.g., Forbes Logo"
                    />
                  </label>
                </>
              )}

              {/* Page Links Section */}
              <div className="faq-modal-label">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>Page Links</span>
                </div>
                {pageLinks.map((pageLink, index) => (
                  <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                    <select
                      className="faq-modal-input featured-dark-input"
                      value={pageLink.pagePath}
                      onChange={(e) => handleUpdatePageLink(index, "pagePath", e.target.value)}
                      style={{ flex: "0 0 150px" }}
                    >
                      {pageOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      className="faq-modal-input featured-dark-input"
                      value={pageLink.link}
                      onChange={(e) => handleUpdatePageLink(index, "link", e.target.value)}
                      placeholder="#"
                      style={{ flex: 1 }}
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "13px", color: "#374151" }}>
                      <input
                        type="checkbox"
                        checked={pageLink.nofollow}
                        onChange={(e) => handleUpdatePageLink(index, "nofollow", e.target.checked)}
                        style={{ width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      <span>Nofollow</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemovePageLink(index)}
                      style={{
                        background: "#fee2e2",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "32px",
                        height: "32px",
                      }}
                      title="Remove link"
                    >
                      <FontAwesomeIcon icon={faX} style={{ fontSize: "12px" }} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddPageLink}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#2563eb",
                    cursor: "pointer",
                    padding: "8px 0",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} style={{ fontSize: "12px" }} />
                  <span>Add Link</span>
                </button>
              </div>
            </div>
            <div className="faq-modal-footer">
              <button
                className="faq-modal-cancel"
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="faq-modal-save"
                onClick={handleSave}
                disabled={saving || !brandName.trim() || pageLinks.length === 0}
              >
                {saving ? "Saving..." : "Save Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
