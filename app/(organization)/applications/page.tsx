"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/lib/supabase";
import type { Application } from "@/types/application";
import type { Student } from "@/types/student";

type ApplicationWithDetails = Application & {
  student?: Student;
  scholarship?: {
    title: string;
    amount: number;
  };
};

export default function ApplicationsPage() {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (organization?.id) {
      fetchApplications();
    }
  }, [organization?.id, selectedStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      // Get scholarships for this organization
      const { data: scholarships } = await supabase
        .from("scholarships")
        .select("id")
        .eq("organization_id", organization!.id);

      if (!scholarships || scholarships.length === 0) {
        setApplications([]);
        return;
      }

      const scholarshipIds = scholarships.map((s) => s.id);

      // Build query
      let query = supabase
        .from("applications")
        .select(
          `
          *,
          student:student_id (
            id,
            full_name,
            email,
            phone,
            gpa,
            university,
            department,
            profile_photo_url
          ),
          scholarship:scholarship_id (
            title,
            amount
          )
        `
        )
        .in("scholarship_id", scholarshipIds)
        .order("created_at", { ascending: false });

      // Filter by status
      if (selectedStatus !== "all") {
        query = query.eq("status", selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      app.student?.full_name?.toLowerCase().includes(search) ||
      app.student?.email?.toLowerCase().includes(search) ||
      app.scholarship?.title?.toLowerCase().includes(search)
    );
  });

  const updateStatus = async (applicationId: string, newStatus: Application["status"]) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", applicationId);

      if (error) throw error;

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Durum güncellenirken hata oluştu");
    }
  };

  const getStatusBadge = (status: Application["status"]) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewing: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      withdrawn: "bg-gray-100 text-gray-800",
    };

    const labels = {
      pending: "Beklemede",
      reviewing: "İnceleniyor",
      approved: "Onaylandı",
      rejected: "Reddedildi",
      withdrawn: "Geri Çekildi",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
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
                  <h2 className="mb-2">Başvurular</h2>
                  <p className="text-muted">
                    Burs başvurularını inceleyin ve yönetin
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-md-2">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <h4 className="mb-0">{stats.total}</h4>
                      <small className="text-muted">Toplam</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <h4 className="mb-0 text-warning">{stats.pending}</h4>
                      <small className="text-muted">Beklemede</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <h4 className="mb-0 text-info">{stats.reviewing}</h4>
                      <small className="text-muted">İnceleniyor</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <h4 className="mb-0 text-success">{stats.approved}</h4>
                      <small className="text-muted">Onaylandı</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <h4 className="mb-0 text-danger">{stats.rejected}</h4>
                      <small className="text-muted">Reddedildi</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Öğrenci adı, email veya burs ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">Tüm Durumlar</option>
                    <option value="pending">Beklemede</option>
                    <option value="reviewing">İnceleniyor</option>
                    <option value="approved">Onaylandı</option>
                    <option value="rejected">Reddedildi</option>
                  </select>
                </div>
              </div>

              {/* Applications Table */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                  </div>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">Henüz başvuru bulunmuyor</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Öğrenci</th>
                        <th>Burs</th>
                        <th>GPA</th>
                        <th>Durum</th>
                        <th>Başvuru Tarihi</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map((app) => (
                        <tr key={app.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {app.student?.profile_photo_url ? (
                                <img
                                  src={app.student.profile_photo_url}
                                  alt={app.student.full_name}
                                  className="rounded-circle me-2"
                                  style={{ width: 40, height: 40, objectFit: "cover" }}
                                />
                              ) : (
                                <div
                                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                                  style={{ width: 40, height: 40 }}
                                >
                                  {app.student?.full_name?.charAt(0) || "?"}
                                </div>
                              )}
                              <div>
                                <div className="fw-bold">
                                  {app.student?.full_name || "İsimsiz"}
                                </div>
                                <small className="text-muted">
                                  {app.student?.email}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>{app.scholarship?.title}</div>
                            <small className="text-muted">
                              {app.scholarship?.amount
                                ? `${app.scholarship.amount.toLocaleString("tr-TR")} ₺`
                                : ""}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-info">
                              {app.student?.gpa || "-"}
                            </span>
                          </td>
                          <td>{getStatusBadge(app.status)}</td>
                          <td>
                            {new Date(app.created_at).toLocaleDateString("tr-TR")}
                          </td>
                          <td>
                            <div className="btn-group">
                              <a
                                href={`/applications/${app.id}`}
                                className="btn btn-sm btn-primary"
                              >
                                İncele
                              </a>
                              {app.status === "pending" && (
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() => updateStatus(app.id, "reviewing")}
                                >
                                  İncelemeye Al
                                </button>
                              )}
                            </div>
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

