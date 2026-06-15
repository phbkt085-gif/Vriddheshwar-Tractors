import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Loader2,
  Upload,
  AlertCircle,
  Trash2,
  LogOut,
  Folder,
  Image as ImageIcon,
  Plus,
  Edit2,
  X,
  Box,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { initialTractors } from "../components/Models";

const SECTIONS = [
  { id: "hero", label: "Hero Image" },
  { id: "deliveries", label: "Happy Customers" },
  { id: "models", label: "Tractor Models" },
  { id: "facilities", label: "Facilities" },
  { id: "about", label: "About Us" },
];

export default function AdminPage() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Models state
  const [modelsData, setModelsData] = useState<any[]>([...initialTractors]);
  const [showModelModal, setShowModelModal] = useState(false);
  const [isEditingModel, setIsEditingModel] = useState(false);
  const [modelForm, setModelForm] = useState({
    id: 0,
    name: "",
    hp: "",
    feature: "",
    marathi: "",
    img: "",
  });
  const [uploadingModelImage, setUploadingModelImage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchImages(activeSection);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchImages(activeSection);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchImages(activeSection);
      if (activeSection === "models") {
        fetchModels();
      }
    }
  }, [activeSection, session]);

  const fetchModels = async () => {
    if (!supabase) return;
    const { data } = await supabase.storage
      .from("public-images")
      .download("models_data.json");
    if (data) {
      try {
        const text = await data.text();
        const parsed = JSON.parse(text);
        if (parsed && Array.isArray(parsed)) {
          // Fix legacy paths from old JSON versions
          const fixedTractors = parsed.map((t: any) => ({
            ...t,
            img: t.img?.startsWith("/src/assets/images/")
              ? t.img.replace("/src/assets/images/", "/images/")
              : t.img,
          }));
          setModelsData(fixedTractors);
          return;
        }
      } catch (e) {
        console.error("Error parsing models_data.json", e);
      }
    }
    setModelsData([...initialTractors]);
  };

  const saveModels = async (newModels: any[]) => {
    if (!supabase) return;
    const file = new Blob([JSON.stringify(newModels)], {
      type: "application/json",
    });
    const { error } = await supabase.storage
      .from("public-images")
      .upload("models_data.json", file, { upsert: true });
    if (!error) {
      setModelsData(newModels);
    } else {
      console.error("Error saving models:", error.message);
    }
  };

  const handleModelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newModels;
    if (isEditingModel) {
      newModels = modelsData.map((m) =>
        m.id === modelForm.id ? modelForm : m,
      );
    } else {
      newModels = [...modelsData, { ...modelForm, id: Date.now() }];
    }
    saveModels(newModels);
    setShowModelModal(false);
  };

  const deleteModel = (id: number) => {
    if (window.confirm("Are you sure you want to delete this model?")) {
      const newModels = modelsData.filter((m) => m.id !== id);
      saveModels(newModels);
    }
  };

  const handleModelImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || e.target.files.length === 0 || !supabase) return;
    setUploadingModelImage(true);
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `models/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const { error } = await supabase.storage
      .from("public-images")
      .upload(fileName, file);
    if (!error) {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/public-images/${fileName}`;
      setModelForm((prev) => ({ ...prev, img: publicUrl }));
      fetchImages(activeSection);
    } else {
      console.error("Error uploading image:", error.message);
    }
    setUploadingModelImage(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setAuthError(
        "Supabase is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      );
      return;
    }
    setLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setAuthError(error.message);
    setLoading(false);
  };

  const fetchImages = async (section: string) => {
    if (!supabase) return;
    const { data, error } = await supabase.storage
      .from("public-images")
      .list(section);
    if (data) {
      // Filter out folder placeholders and empty entries
      setFiles(
        data.filter((f) => f.name && f.name !== ".emptyFolderPlaceholder"),
      );
    } else {
      setFiles([]);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !supabase) return;

    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${activeSection}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("public-images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error.message);
      alert("Upload error: " + error.message);
    } else {
      fetchImages(activeSection);
    }
    setUploading(false);
  };

  const confirmDelete = async () => {
    if (!supabase || !imageToDelete) return;
    setDeleting(true);
    const { error } = await supabase.storage
      .from("public-images")
      .remove([`${activeSection}/${imageToDelete}`]);
    if (error) {
      console.error("Delete error:", error.message);
    }
    await fetchImages(activeSection);
    setDeleting(false);
    setImageToDelete(null);
  };

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
        <div className="max-w-md bg-white p-8 rounded-xl shadow border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Supabase Keys Missing</h2>
          <p className="text-slate-600 mb-6 text-sm">
            Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in
            your env secrets to enable admin features.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
            <p className="text-sm text-slate-500 mt-2">
              Only authorized personnel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-200 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-red-200 focus:border-red-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-slate-500 hover:text-slate-800"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-xs text-slate-500">Manage your website content</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
          >
            View Site
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r h-full flex flex-col hidden md:flex">
          <div className="p-4 border-b">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sections
            </h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeSection === s.id ? "bg-red-50 text-red-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Folder
                  className={`w-4 h-4 ${activeSection === s.id ? "text-red-500" : "text-slate-400"}`}
                />
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Mobile Tabs */}
          <div className="flex md:hidden overflow-x-auto gap-2 mb-6 pb-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${activeSection === s.id ? "bg-red-50 border-red-200 text-red-700" : "bg-white border-slate-200 text-slate-600"}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {SECTIONS.find((s) => s.id === activeSection)?.label} Content
              </h2>
            </div>

            {activeSection === "models" && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 tracking-wide text-sm uppercase flex items-center gap-2">
                    <Box className="w-4 h-4 text-slate-400" /> Tractor Models
                  </h3>
                  <button
                    onClick={() => {
                      setIsEditingModel(false);
                      setModelForm({
                        id: 0,
                        name: "",
                        hp: "",
                        feature: "",
                        marathi: "",
                        img: "",
                      });
                      setShowModelModal(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4" /> Add Model
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-600 font-medium">
                      <tr>
                        <th className="px-4 py-3">Model Name</th>
                        <th className="px-4 py-3">HP</th>
                        <th className="px-4 py-3">Feature (English/Marathi)</th>
                        <th className="px-4 py-3">Image Link</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {modelsData.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {m.name}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{m.hp}</td>
                          <td className="px-4 py-3 text-slate-600 truncate max-w-[200px]">
                            {m.feature} / {m.marathi}
                          </td>
                          <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]">
                            {m.img}
                          </td>
                          <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setIsEditingModel(true);
                                setModelForm(m);
                                setShowModelModal(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-900 bg-white rounded-md border border-slate-200 hover:border-slate-300"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteModel(m.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 bg-white rounded-md border border-slate-200 hover:border-red-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
              <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-700">
                <Upload className="w-4 h-4" /> Upload New Image
              </h2>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-2" />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    )}
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Uploading to <strong>{activeSection}</strong> folder
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={uploadImage}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <h3 className="font-bold text-slate-800 tracking-wide mb-4 text-sm uppercase flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" /> Uploaded Images
            </h3>

            {files.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 border-dashed flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <p className="text-slate-600 font-medium">
                  No images uploaded to this section yet.
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  Upload photos above to securely display them on the website.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="group relative bg-white rounded-xl shadow-sm overflow-hidden aspect-video md:aspect-square border border-slate-200"
                  >
                    <img
                      src={`${supabaseUrl}/storage/v1/object/public/public-images/${activeSection}/${file.name}`}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => setImageToDelete(file.name)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-700 shadow-lg transform hover:scale-105 transition-all"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-6 pointer-events-none">
                      <p className="text-[10px] sm:text-xs text-white/90 truncate font-medium">
                        {file.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {imageToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Delete Image
            </h3>
            <p className="text-slate-500 mb-6">
              Are you sure you want to delete this image? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setImageToDelete(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModelModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                {isEditingModel ? "Edit Model" : "Add Model"}
              </h3>
              <button
                onClick={() => setShowModelModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModelSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Model Name
                  </label>
                  <input
                    type="text"
                    required
                    value={modelForm.name}
                    onChange={(e) =>
                      setModelForm({ ...modelForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Horsepower (HP)
                  </label>
                  <input
                    type="text"
                    required
                    value={modelForm.hp}
                    onChange={(e) =>
                      setModelForm({ ...modelForm, hp: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Feature (English)
                </label>
                <input
                  type="text"
                  required
                  value={modelForm.feature}
                  onChange={(e) =>
                    setModelForm({ ...modelForm, feature: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Feature (Marathi)
                </label>
                <input
                  type="text"
                  required
                  value={modelForm.marathi}
                  onChange={(e) =>
                    setModelForm({ ...modelForm, marathi: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Image{" "}
                  <span className="text-xs text-slate-500 font-normal">
                    (Upload from device or paste URL)
                  </span>
                </label>
                <div className="flex gap-2 items-center mb-2">
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors shadow-sm border border-slate-200 shrink-0">
                    {uploadingModelImage ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> ...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" /> Upload File
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleModelImageUpload}
                      disabled={uploadingModelImage}
                    />
                  </label>
                  <span className="text-slate-400 text-xs font-semibold shrink-0">
                    OR
                  </span>
                  <input
                    type="text"
                    value={modelForm.img}
                    onChange={(e) =>
                      setModelForm({ ...modelForm, img: e.target.value })
                    }
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-red-200 outline-none text-sm w-full"
                  />
                </div>

                {modelForm.img && (
                  <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between">
                    <span className="truncate flex-1 mr-4 text-xs">
                      {modelForm.img}
                    </span>
                    {modelForm.img.startsWith("http") ||
                    modelForm.img.startsWith("/") ? (
                      <img
                        src={modelForm.img}
                        alt="Preview"
                        className="w-10 h-10 object-cover rounded shadow-sm border border-slate-200 shrink-0"
                      />
                    ) : null}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModelModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Save Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
