import { Link, Outlet } from "react-router-dom";

function Production() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Production</h1>

        <Link to="/newproduction">New PCS</Link>
        <Link to="/newdailyconsumption">New PCS</Link>
      </div>
    </div>
  );
}

export default Production;
