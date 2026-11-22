import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateProfile, logout } from "../../store/slices/authSlice";
import { User, Mail, Edit, Save, X, LogOut, ShoppingBag } from "lucide-react";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] text-stone-900 flex flex-col items-center justify-center px-4">
        <User size={50} className="text-orange-400 mb-4" />
        <h2 className="text-2xl font-bold">Login Required</h2>
        <p className="text-slate-400 mt-2 mb-6">
          Please login to view your profile.
        </p>
        <Link to="/login" className="bg-orange-600 px-6 py-3 rounded-xl">
          Login Now
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("shopsphere_users") || "[]");

    const emailExists = users.some(
      (item) => item.email === form.email && item.id !== user.id,
    );

    if (emailExists) {
      alert("This email is already registered.");
      return;
    }

    const updatedUsers = users.map((item) =>
      item.id === user.id
        ? { ...item, name: form.name, email: form.email }
        : item,
    );

    localStorage.setItem("shopsphere_users", JSON.stringify(updatedUsers));

    dispatch(updateProfile(form));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] text-stone-900 px-5 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest">
            Account Settings
          </p>
          <h1 className="text-4xl font-bold mt-2">My Profile</h1>
          <p className="text-slate-400 mt-2">
            Manage your personal information.
          </p>
        </div>

        <div className="bg-white border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-full bg-orange-600 flex items-center justify-center">
              <User size={38} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-slate-400">{user.email}</p>
              <span className="text-xs text-orange-400 mt-2 inline-block">
                ShopSphere Member
              </span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-7">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-orange-400 hover:text-orange-300"
                >
                  <Edit size={17} />
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-4 text-slate-500"
                  />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 disabled:opacity-70"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-4 text-slate-500"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 disabled:opacity-70"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl font-semibold"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-orange-400" />
              <span className="text-slate-300">Continue shopping</span>
            </div>

            <Link
              to="/products"
              className="text-orange-400 hover:text-orange-300"
            >
              Explore Products →
            </Link>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="mt-8 flex items-center gap-2 text-red-400 hover:text-red-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
