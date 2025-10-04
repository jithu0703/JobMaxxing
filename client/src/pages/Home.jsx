import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to Velai-Vaaippu</h1>
      <Link to="/jobs">View Jobs</Link>
    </div>
  );
}

export default Home;
