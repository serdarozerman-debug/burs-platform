"use client";

import { useState, useEffect } from "react";

interface Organization {
  name: string;
  logo: string | null;
  hasFavicon: boolean;
}

export default function FaviconManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "missing">("missing");
  const [editingOrg, setEditingOrg] = useState<string | null>(null);
  const [newFaviconUrl, setNewFaviconUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, [filter]);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/favicon?missing=${filter === "missing"}`;
      const response = await fetch(url);
      const data = await response.json();
      setOrganizations(data.organizations || []);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      alert("Organizasyonlar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const updateFavicon = async (orgId: string, orgName: string, faviconUrl: string) => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/favicon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: orgId,
          favicon_url: faviconUrl,
        }),
      });

      if (!response.ok) throw new Error("Update failed");

      alert(`✅ ${orgName} için favicon güncellendi!`);
      setEditingOrg(null);
      setNewFaviconUrl("");
      fetchOrganizations();
    } catch (error) {
      console.error("Error updating favicon:", error);
      alert("Favicon güncellenirken hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const generateFaviconUrl = (orgName: string) => {
    // Common patterns for favicon URLs
    const cleanName = orgName.toLowerCase()
      .replace(/üniversitesi|vakfı|belediyesi/gi, "")
      .trim();
    
    return [
      `https://www.${cleanName}.com.tr/favicon.ico`,
      `https://www.${cleanName}.org.tr/favicon.ico`,
      `https://www.${cleanName}.edu.tr/favicon.ico`,
      `https://${cleanName}.com.tr/images/logo.png`,
    ];
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="section-box mb-30">
            <div className="container">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="mb-2">Favicon Yönetimi</h2>
                  <p className="text-muted">
                    Kurum logolarını ekleyin veya güncelleyin
                  </p>
                </div>
                <div className="btn-group">
                  <button
                    className={`btn ${filter === "missing" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setFilter("missing")}
                  >
                    Eksik Olanlar
                  </button>
                  <button
                    className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setFilter("all")}
                  >
                    Tümü
                  </button>
                </div>
              </div>

              {/* Stats */}
              {!loading && (
                <div className="alert alert-info mb-4">
                  <strong>📊 İstatistikler:</strong>{" "}
                  Toplam {organizations.length} organizasyon,{" "}
                  {organizations.filter((o) => !o.hasFavicon).length} favicon eksik
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                </div>
              )}

              {/* Organizations List */}
              {!loading && organizations.length === 0 && (
                <div className="text-center py-5">
                  <p className="text-muted">
                    {filter === "missing"
                      ? "Tüm organizasyonların favicon'u mevcut! 🎉"
                      : "Henüz organizasyon bulunmuyor"}
                  </p>
                </div>
              )}

              {!loading && organizations.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Logo</th>
                        <th>Organizasyon</th>
                        <th>Favicon URL</th>
                        <th>Durum</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizations.map((org) => (
                        <tr key={org.name}>
                          <td>
                            {org.hasFavicon ? (
                              <img
                                src={org.logo!}
                                alt={org.name}
                                style={{ width: 32, height: 32, objectFit: "contain" }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/32?text=?";
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  borderRadius: 4,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontWeight: "bold",
                                }}
                              >
                                {org.name.charAt(0)}
                              </div>
                            )}
                          </td>
                          <td>
                            <strong>{org.name}</strong>
                          </td>
                          <td>
                            {editingOrg === org.name ? (
                              <div>
                                <input
                                  type="text"
                                  className="form-control form-control-sm mb-2"
                                  placeholder="https://example.com/logo.png"
                                  value={newFaviconUrl}
                                  onChange={(e) => setNewFaviconUrl(e.target.value)}
                                />
                                <details className="mb-2">
                                  <summary className="small text-muted" style={{ cursor: "pointer" }}>
                                    💡 Önerilen URL'ler
                                  </summary>
                                  <div className="mt-2">
                                    {generateFaviconUrl(org.name).map((url, i) => (
                                      <div key={i} className="mb-1">
                                        <button
                                          className="btn btn-sm btn-outline-secondary me-2"
                                          onClick={() => setNewFaviconUrl(url)}
                                        >
                                          Kullan
                                        </button>
                                        <code className="small">{url}</code>
                                      </div>
                                    ))}
                                  </div>
                                </details>
                              </div>
                            ) : (
                              <code className="small">
                                {org.logo || <span className="text-muted">Yok</span>}
                              </code>
                            )}
                          </td>
                          <td>
                            {org.hasFavicon ? (
                              <span className="badge bg-success">✓ Var</span>
                            ) : (
                              <span className="badge bg-warning">⚠ Eksik</span>
                            )}
                          </td>
                          <td>
                            {editingOrg === org.name ? (
                              <div className="btn-group">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => updateFavicon(org.id, org.name, newFaviconUrl)}
                                  disabled={!newFaviconUrl || saving}
                                >
                                  {saving ? "Kaydediliyor..." : "Kaydet"}
                                </button>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => {
                                    setEditingOrg(null);
                                    setNewFaviconUrl("");
                                  }}
                                  disabled={saving}
                                >
                                  İptal
                                </button>
                              </div>
                            ) : (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => {
                                  setEditingOrg(org.name);
                                  setNewFaviconUrl(org.logo || "");
                                }}
                              >
                                {org.hasFavicon ? "Düzenle" : "Ekle"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

