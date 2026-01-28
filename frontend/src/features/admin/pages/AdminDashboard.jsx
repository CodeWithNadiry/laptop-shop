import StatsCards from "../components/dashboard/stats-cards/StatsCards";
import QuickActions from "../components/dashboard/quick-actions/QuickAction";

const AdminDashboard = () => {
  return (
    <div className="sec-container">
    <h1>Admin Dashboard</h1>
      <StatsCards />
      <QuickActions />
    </div>
  );
};

export default AdminDashboard;