import { UserAuth } from '../context/authContext';
import Chat from './chat';
import Workspace from './workspace';
const Dashboard = () => {
  const { session, logOut } = UserAuth();
  return (
    <div className='flex justify-between flex-col'>
      <div className="">
        <h2>Dashboard A GYA JE</h2>
        <h2>{session.user.email}</h2>
        <button onClick={logOut}>logging out </button>
      </div>
      <div className="h-full w-full">
        {/* <Chat/> */}
        <Workspace />
      </div>
    </div>
  );
};

export default Dashboard;
