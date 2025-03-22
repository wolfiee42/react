import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div>
      Welcome to dashboard. <Outlet />{" "}
    </div>
  );
}
