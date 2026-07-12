import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import EditProfileModal from "../../components/modals/EditProfileModal";
import GitHubCard from "../../components/github/GitHubCard";

import {
  BadgeCheck,
  Globe,
  Mail,
  MapPin,
} from "lucide-react";

import {
  getProfile,
  updateProfile,
} from "../../api/userApi";

export default function Profile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setProfileError("");

        const user = await getProfile();

        setProfile({
          ...user,
          location: user.location || "India",
          linkedin: user.linkedin || "",
        });
      } catch (error) {
        console.error("Profile loading error:", error);

        setProfileError(
          error.response?.data?.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (
    updatedProfile
  ) => {
    try {
      const user = await updateProfile(
        updatedProfile
      );

      setProfile((previousProfile) => ({
        ...previousProfile,
        ...user,
      }));

      setIsEditOpen(false);
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );
    }
  };

  const handleGitHubVerified = (response) => {
    if (!response?.github) {
      return;
    }

    setProfile((previousProfile) => ({
      ...previousProfile,

      github:
        response.github.profileUrl ||
        previousProfile.github,

      githubUsername:
        response.github.username ||
        previousProfile.githubUsername,

      githubScore:
        response.githubScore ??
        previousProfile.githubScore,

      githubAnalytics:
        response.github ||
        previousProfile.githubAnalytics,

      trustScore:
        response.user?.trustScore ??
        previousProfile.trustScore,
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />

            <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
              Loading Profile...
            </h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <h2 className="text-xl font-semibold text-red-500">
              Failed to load profile
            </h2>

            <p className="mt-2 text-sm text-red-400">
              {profileError ||
                "Please refresh the page and try again."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Profile Header */}
      <Card className="mb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <img
              src={
                profile.avatar ||
                "https://i.pravatar.cc/200?img=12"
              }
              alt={profile.name || "Profile"}
              className="h-28 w-28 rounded-full border-4 border-blue-500 object-cover"
            />

            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {profile.name}
                </h2>

                <BadgeCheck
                  className="text-green-500"
                  size={24}
                />
              </div>

              <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                {profile.title || "Developer"}
              </p>

              <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-slate-600 dark:text-slate-400 sm:justify-start">
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {profile.location || "India"}
                </span>

                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  {profile.email}
                </span>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setIsEditOpen(true)}
          >
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* About and Trust Score */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
            About
          </h3>

          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            {profile.bio || "No bio added yet."}
          </p>
        </Card>

        <Card>
          <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
            Trust Score
          </h3>

          <div className="text-center">
            <h2 className="text-6xl font-bold text-blue-500">
              {profile.trustScore || 0}
            </h2>

            <p className="mt-2 text-green-400">
              {profile.trustScore >= 90
                ? "Elite Verified"
                : profile.trustScore >= 70
                  ? "Verified Developer"
                  : "Growing Developer"}
            </p>
          </div>
        </Card>
      </div>

      {/* GitHub Verification */}
      <div className="mt-6">
        <GitHubCard
          initialUsername={
            profile.githubUsername || ""
          }
          onVerified={handleGitHubVerified}
        />
      </div>

      {/* Skills */}
      <Card className="mt-6">
        <h3 className="mb-5 text-xl font-semibold text-slate-900 dark:text-white">
          Skills
        </h3>

        <div className="flex flex-wrap gap-3">
          {profile.skills?.length ? (
            profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-500"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-slate-500 dark:text-slate-400">
              No skills added yet.
            </p>
          )}
        </div>
      </Card>

      {/* Social Links */}
      <Card className="mt-6">
        <h3 className="mb-5 text-xl font-semibold text-slate-900 dark:text-white">
          Social Links
        </h3>

        <div className="flex flex-wrap gap-4">
          {profile.github ? (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-slate-700 transition hover:border-blue-500 hover:text-blue-500 dark:border-slate-700 dark:text-slate-300"
            >
              <Globe size={18} />
              GitHub
            </a>
          ) : (
            <span className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-slate-400 opacity-60 dark:border-slate-700">
              <Globe size={18} />
              GitHub not connected
            </span>
          )}

          {profile.linkedin ? (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-slate-700 transition hover:border-blue-500 hover:text-blue-500 dark:border-slate-700 dark:text-slate-300"
            >
              <Globe size={18} />
              LinkedIn
            </a>
          ) : (
            <span className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-slate-400 opacity-60 dark:border-slate-700">
              <Globe size={18} />
              LinkedIn not added
            </span>
          )}

          {profile.portfolio ? (
            <a
              href={profile.portfolio}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-slate-700 transition hover:border-blue-500 hover:text-blue-500 dark:border-slate-700 dark:text-slate-300"
            >
              <Globe size={18} />
              Portfolio
            </a>
          ) : (
            <span className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-slate-400 opacity-60 dark:border-slate-700">
              <Globe size={18} />
              Portfolio not added
            </span>
          )}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="mt-6">
        <h3 className="mb-5 text-xl font-semibold text-slate-900 dark:text-white">
          Achievements & Badges
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div
            className={`rounded-2xl border p-5 text-center ${
              profile.githubAnalytics?.verified
                ? "border-green-500/30 bg-green-500/10"
                : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            <h4 className="font-semibold text-slate-900 dark:text-white">
              GitHub Verified
            </h4>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {profile.githubAnalytics?.verified
                ? `Verified with score ${
                    profile.githubScore || 0
                  }/100`
                : "Connect and verify your GitHub profile"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-900">
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Project Verified
            </h4>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Verified project evidence
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-900">
            <h4 className="font-semibold text-slate-900 dark:text-white">
              AI Reviewed
            </h4>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Profile quality analysis
            </p>
          </div>
        </div>
      </Card>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </DashboardLayout>
  );
}