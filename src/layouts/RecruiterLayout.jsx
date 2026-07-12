import DashboardLayout from "./DashboardLayout";

export default function RecruiterLayout({ children }) {
  return (
    <DashboardLayout recruiter={true}>
      {children}
    </DashboardLayout>
  );
}
