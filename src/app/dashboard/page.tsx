"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DashboardView from "./_components/dashboard-view";

const fetchDashboardData = async () => {
  const { data } = await axios.get("/api/dashboard");
  return data;
};

export default function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardView user={data.profile} items={data.items} stats={data.stats} />
  );
}
