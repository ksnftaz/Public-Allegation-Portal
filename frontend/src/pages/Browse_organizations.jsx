// frontend/src/pages/Browse_organizations.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Building2, 
  Globe, 
  Lock, 
  Loader2, 
  ArrowLeft,
  MapPin,
  Users,
  FileText,
  ShieldCheck
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Browse_organizations() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrgs, setFilteredOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, public, private

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    filterOrganizations();
  }, [searchQuery, filterType, organizations]);

  const fetchOrganizations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/organizations`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (!res.ok) throw new Error("Failed to fetch organizations");

      const data = await res.json();
      const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setOrganizations(items);
      setFilteredOrgs(items);
    } catch (e) {
      console.error("[fetch organizations error]", e);
      setError(e.message || "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const filterOrganizations = () => {
    let filtered = [...organizations];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(org => 
        org.name.toLowerCase().includes(query) ||
        org.slug.toLowerCase().includes(query) ||
        org.address?.toLowerCase().includes(query) ||
        org.description?.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(org => 
        org.access_type.toLowerCase() === filterType.toLowerCase()
      );
    }

    setFilteredOrgs(filtered);
  };

  const handleCardClick = (slug) => {
    navigate(`/organization/${slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          <p className="text-sm text-gray-600 font-medium">Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl font-medium">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="rounded-md p-1 bg-gradient-to-r from-green-100 to-green-200">
                <ShieldCheck size={28} className="text-green-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Browse All Organizations</h1>
                <p className="text-sm text-gray-600">Discover public and private organizations</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizations by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                  filterType === "all"
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                All ({organizations.length})
              </button>
              <button
                onClick={() => setFilterType("public")}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all inline-flex items-center gap-2 ${
                  filterType === "public"
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Globe className="w-4 h-4" />
                Public ({organizations.filter(o => o.access_type === "Public").length})
              </button>
              <button
                onClick={() => setFilterType("private")}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all inline-flex items-center gap-2 ${
                  filterType === "private"
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Lock className="w-4 h-4" />
                Private ({organizations.filter(o => o.access_type === "Private").length})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredOrgs.length}</div>
                <div className="text-sm text-gray-600">Organizations Found</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredOrgs.filter(o => o.access_type === "Public").length}
                </div>
                <div className="text-sm text-gray-600">Public Organizations</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredOrgs.filter(o => o.access_type === "Private").length}
                </div>
                <div className="text-sm text-gray-600">Private Organizations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        {filteredOrgs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No organizations found</h3>
            <p className="text-sm text-gray-600 mb-6">
              {searchQuery 
                ? "Try adjusting your search query or filters"
                : "There are no organizations available at this time"}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                onClick={() => handleCardClick(org.slug)}
                className="group bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              >
                {/* Organization Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="w-12 h-12 rounded-lg object-cover ring-2 ring-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-green-700" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                          {org.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono truncate">/{org.slug}</p>
                      </div>
                    </div>
                    
                    {/* Access Type Badge */}
                    <div className="flex-shrink-0 ml-2">
                      {org.access_type === "Public" ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 border border-green-200">
                          <Globe className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Public</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 border border-gray-200">
                          <Lock className="w-3 h-3 text-gray-600" />
                          <span className="text-xs font-medium text-gray-700">Private</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {org.description || "No description available"}
                  </p>

                  {/* Location */}
                  {org.address && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{org.address}</span>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>Members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Complaints</span>
                      </div>
                    </div>
                    
                    <button
                      className="text-sm font-medium text-green-600 group-hover:text-green-700 inline-flex items-center gap-1"
                    >
                      View
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            About Organization Types
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Public Organizations
              </h4>
              <ul className="space-y-1 text-xs">
                <li>• Anyone can view complaints and information</li>
                <li>• No login required to browse</li>
                <li>• Login required to file complaints</li>
                <li>• Ideal for government and public service organizations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Private Organizations
              </h4>
              <ul className="space-y-1 text-xs">
                <li>• Login required to view complaints</li>
                <li>• Only registered members can access</li>
                <li>• Enhanced privacy and security</li>
                <li>• Ideal for private institutions and companies</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}