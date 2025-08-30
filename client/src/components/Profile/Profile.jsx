import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useMutation, useQuery } from "react-query";
import { authAPI } from "../../services/api";
import LoadingSpinner from "../Common/LoadingSpinner";
import Modal from "../UI/Modal";
import {
  User,
  Mail,
  Shield,
  Bell,
  Moon,
  Sun,
  Edit2,
  Save,
  X,
  Camera,
  Activity,
  FileText,
  Calendar,
  Settings,
} from "lucide-react";
import { formatDate, getInitials } from "../../utils/helpers";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch fresh profile data
  const {
    data: profileData,
    isLoading,
    refetch,
  } = useQuery("profile", authAPI.getProfile, {
    select: (response) => response.data.user,
    initialData: { data: { user } },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation(
    async (profileData) => {
      const response = await authAPI.updateProfile(profileData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        refetch();
        // Update auth context
        login(data.user, localStorage.getItem("token"));
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to update profile"
        );
      },
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      preferences: {
        emailNotifications: true,
        darkMode: false,
      },
    },
  });

  const preferences = watch("preferences");

  // Populate form when profile data loads
  useEffect(() => {
    if (profileData) {
      setValue("name", profileData.name || "");
      setValue("email", profileData.email || "");
      setValue("preferences", {
        emailNotifications: profileData.preferences?.emailNotifications ?? true,
        darkMode: profileData.preferences?.darkMode ?? false,
      });
    }
  }, [profileData, setValue]);

  const onSubmit = async (data) => {
    await updateProfileMutation.mutateAsync(data);
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmed) return;
    }
    setIsEditing(false);
    // Reset form to original values
    if (profileData) {
      setValue("name", profileData.name);
      setValue("email", profileData.email);
      setValue("preferences", profileData.preferences || {});
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  if (isLoading && !profileData) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profileData?.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(profileData?.name || "")
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Camera size={16} className="text-gray-600" />
                </button>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData?.name}
                </h1>
                <p className="text-gray-600">{profileData?.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Shield size={14} />
                    <span className="capitalize">{profileData?.role}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>Joined {formatDate(profileData?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Edit2 size={16} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={updateProfileMutation.isLoading}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    {updateProfileMutation.isLoading ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <Save size={16} />
                    )}
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Personal Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    disabled={!isEditing}
                    className={`input ${!isEditing ? "bg-gray-50" : ""} ${
                      errors.name
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : ""
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                    disabled={!isEditing}
                    className={`input ${!isEditing ? "bg-gray-50" : ""} ${
                      errors.email
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : ""
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profileData?.role || ""}
                    disabled
                    className="input bg-gray-50 capitalize"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Contact an administrator to change your role
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Active
                  </label>
                  <input
                    type="text"
                    value={
                      profileData?.lastActive
                        ? formatDate(profileData.lastActive)
                        : "Never"
                    }
                    disabled
                    className="input bg-gray-50"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Security
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-500">
                      Last updated:{" "}
                      {formatDate(
                        profileData?.updatedAt || profileData?.createdAt
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="btn btn-secondary"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {isDirty && isEditing && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800">
                    You have unsaved changes. Click "Save Changes" to update
                    your profile.
                  </p>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Preferences
            </h2>

            <div className="space-y-6">
              {/* Notifications */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell size={20} className="text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Email Notifications
                        </h4>
                        <p className="text-sm text-gray-500">
                          Receive email updates about document changes and
                          activities
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("preferences.emailNotifications")}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {preferences?.darkMode ? (
                        <Moon size={20} className="text-gray-400" />
                      ) : (
                        <Sun size={20} className="text-gray-400" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">Dark Mode</h4>
                        <p className="text-sm text-gray-500">
                          Switch to dark theme for better viewing in low light
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("preferences.darkMode")}
                        disabled={!isEditing}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <ProfileActivity userId={profileData?._id} />
        )}
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

// Password Change Modal Component
const PasswordChangeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // This would call a password change API endpoint
      // await authAPI.changePassword(formData)
      toast.success("Password changed successfully!");
      onClose();
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={`input ${
              errors.currentPassword ? "border-red-300" : ""
            }`}
            placeholder="Enter current password"
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.currentPassword}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={`input ${errors.newPassword ? "border-red-300" : ""}`}
            placeholder="Enter new password"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`input ${
              errors.confirmPassword ? "border-red-300" : ""
            }`}
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Profile Activity Component
const ProfileActivity = ({ userId }) => {
  const { data: activityData, isLoading } = useQuery(
    ["user-activity", userId],
    () => {
      // This would fetch user-specific activity
      // For now, return mock data
      return Promise.resolve({
        data: {
          stats: {
            documentsCreated: 12,
            documentsEdited: 28,
            totalViews: 156,
            collaborations: 5,
          },
          recentActivity: [
            {
              id: 1,
              action: "created",
              resource: "document",
              title: "Project Requirements",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
            {
              id: 2,
              action: "updated",
              resource: "document",
              title: "API Documentation",
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            },
          ],
        },
      });
    },
    {
      enabled: !!userId,
    }
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  const stats = activityData?.data?.stats || {};
  const recentActivity = activityData?.data?.recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Documents Created
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.documentsCreated || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <Edit2 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Documents Edited
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.documentsEdited || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Collaborations
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.collaborations || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalViews || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Recent Activity
        </h3>

        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium capitalize">
                      {activity.action}
                    </span>{" "}
                    {activity.resource}{" "}
                    <span className="font-medium">"{activity.title}"</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
