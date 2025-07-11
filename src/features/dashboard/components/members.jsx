import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserAuth } from "@/context/authContext.jsx";
const Members = () => {
  const [emails, setEmails] = useState([]);
  // const [dataResponse, setdataResponse] = useState([])
  const [error, setError] = useState("");
  const [activeMail, setActiveMail] = useState("");
  const [isAdmin, setisAdmin] = useState(false);
  const { workspaceId } = useParams();
  const { session } = UserAuth();
  const fetchMembers = async () => {
    axios
      .post("/api/fetchMembersinWs", {
        workspaceId: workspaceId,
      })
      .then((res) => {
        const result = res?.data?.data;
        checkAdmin(result);
      })
      .catch((err) => {
        setError(err);
      });
  };
  useEffect(() => {
    fetchMembers();
    setActiveMail(session?.user?.email);
  }, [session, activeMail]);
  //doing this task to check admin and only show message to admin so
  // others cant use update feature
  const checkAdmin = (usersArray) => {
    const activeEmail = session?.user?.email;
    setEmails(usersArray);
    const currentUser = usersArray.find((user) => user.email === activeEmail);

    if (currentUser?.role === "admin") {
      setisAdmin(true);
    }
  };
  const handleAdmin = async (m) => {
    const mail = m.email;
    axios
      .post("/api/fetchMembersinWs/options", {
        mail: mail,
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="absolute ">
      <h1 className="text-amber-50 text-9xl"> Members</h1>
      {emails.map((m, i) => (
        <ul key={i}>
          <li>{m.email}</li>
          {isAdmin && (
            <button onClick={() => handleAdmin(m)} className="text-white">
              make admin
            </button>
          )}
        </ul>
      ))}
      {error && <>{error.message}</>}
    </div>
  );
};

export default Members;
