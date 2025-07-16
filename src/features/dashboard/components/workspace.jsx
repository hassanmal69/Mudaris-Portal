import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { supabase } from "../../../services/supabaseClient.js";
import { Link } from "react-router-dom";
import { UserAuth } from "../../../context/authContext.jsx";

const Workspace = () => {
  const { session } = UserAuth();
  const [workspace, setworkspace] = useState("");
  const [allworkspace, setAllworkspace] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAllworkspace((prev) => [...prev, workspace]);
    if (!workspace.trim()) return;
    setworkspace("");
    const id = session.user?.id;
    try {
      await axios.post("/api/ws", {
        workspace,
        id,
      });
    } catch (error) {
      console.error("error coming in workspacees", error);
    }
  };
  const fetchWorkspaces = () => {
    axios
      .get("/api/ws/getData")
      .then((response) => {
        setAllworkspace(response?.data?.data);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    fetchWorkspaces();
    const channel = supabase
      .channel("ws-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "workspaces",
          filter: `user_id=eq.${session?.user?.id}`,
        },
        (payload) => {
          const newWorkSpace = payload.new;
          setAllworkspace((prev) => {
            const existingWorkspace = prev.find(
              (item) => item.id === newWorkSpace.id
            );
            if (existingWorkspace) {
              return prev.map((w) =>
                w.id === newWorkSpace.id ? newWorkSpace : w
              );
            }
            return [...prev, newWorkSpace];
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section>
      {/* <form onSubmit={handleSubmit} method="post">
        <input
          type="text"
          placeholder="add your workspace"
          value={workspace}
          onChange={(e) => setworkspace(e.target.value)}
        />
        <button>add</button>
      </form> */}
      {allworkspace.map((w, i) => (
        <Link
          key={i}
          to={`/workspace/${w.id}`}
          className="flex flex-col"
          style={{ textDecoration: "none" }}
        >
          <button>{w.workspace_name}</button>
        </Link>
      ))}
    </section>
  );
};

export default Workspace;
