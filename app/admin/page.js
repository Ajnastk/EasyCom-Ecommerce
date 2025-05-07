

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      
      {/* <StatsCards /> */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          {/* <SalesChart /> */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          {/* <RecentOrders /> */}
        </div>
      </div>
    </div>
  );
}
