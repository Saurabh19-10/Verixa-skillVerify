import { useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import EditRecruiterProfileModal from "../../components/modals/EditRecruiterProfileModal";

import { useAuth } from "../../context/AuthContext";
import { useRecruiter } from "../../context/RecruiterContext";

import {
  Globe,
  Mail,
  MapPin,
  Phone,
  BadgeCheck,
  Briefcase,
  Users,
  UserCheck,
  Building2,
} from "lucide-react";

export default function RecruiterProfile() {
  const { user } = useAuth();
  const { shortlist, pipeline } = useRecruiter();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "Saurabh Rai",
    title: "Technical Recruiter",
    company: "Verixa Talent Partners",
    email: user?.email || "recruiter@verixa.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",

    bio:
      "Technical recruiter focused on hiring verified full-stack and backend engineers. I rely on GitHub activity, project validation, and coding assessments to shortlist candidates faster and with more confidence.",

    companyWebsite: "https://company.com",
    linkedin: "https://linkedin.com",

    hiringFocus: [
      "React",
      "Node.js",
      "Full Stack",
      "DevOps",
      "Python",
    ],
  });

  const handleSaveProfile = (updatedProfile) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  const hiredCount = Object.values(pipeline).filter(
    (stage) => stage === "Hired"
  ).length;

  const interviewingCount = Object.values(pipeline).filter(
    (stage) => stage === "Interviewing"
  ).length;

  return (
    <DashboardLayout
      recruiter
      title="My Profile"
      subtitle="Manage your recruiter account and hiring preferences"
    >
      {/* Profile Header */}
      <Card className="mb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-6">
            <img
              src="https://i.pravatar.cc/200?img=33"
              alt="profile"
              className="h-28 w-28 rounded-full border-4 border-blue-500"
            />

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {profile.name}
                </h2>

                <BadgeCheck
                  className="text-green-500"
                  size={24}
                />
              </div>

              <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                {profile.title} @ {profile.company}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {profile.location}
                </span>

                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  {profile.email}
                </span>

                <span className="flex items-center gap-2">
                  <Phone size={16} />
                  {profile.phone}
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

      {/* Hiring Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500">
              <Users size={22} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {shortlist.length}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Shortlisted
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Briefcase size={22} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {interviewingCount}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Interviewing
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <UserCheck size={22} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {hiredCount}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                Hired
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* About */}
      <Card className="mt-6">
        <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
          About
        </h3>

        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          {profile.bio}
        </p>
      </Card>

      {/* Hiring Focus */}
      <Card className="mt-6">
        <h3 className="mb-5 text-xl font-semibold text-slate-900 dark:text-white">
          Hiring Focus
        </h3>

        <div className="flex flex-wrap gap-3">
          {profile.hiringFocus.map((skill) => (
            <span
              key={skill}
              className="
                rounded-full
                bg-blue-500/10
                px-4 py-2
                text-sm
                text-blue-400
              "
            >
              {skill}
            </span>
          ))}
        </div>
      </Card>

      {/* Company & Links */}
      <Card className="mt-6">
        <h3 className="mb-5 text-xl font-semibold text-slate-900 dark:text-white">
          Company & Links
        </h3>

        <div className="flex flex-wrap gap-4">
          <a
            href={profile.companyWebsite}
            target="_blank"
            rel="noreferrer"
            className="
              flex items-center gap-2
              rounded-xl border border-slate-300 dark:border-slate-700
              px-4 py-3 text-slate-700 dark:text-slate-300
              hover:border-blue-500
            "
          >
            <Building2 size={18} />
            Company Website
          </a>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="
              flex items-center gap-2
              rounded-xl border border-slate-300 dark:border-slate-700
              px-4 py-3 text-slate-700 dark:text-slate-300
              hover:border-blue-500
            "
          >
            <Globe size={18} />
            LinkedIn
          </a>
        </div>
      </Card>

      {/* Edit Modal */}
      <EditRecruiterProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </DashboardLayout>
  );
}
