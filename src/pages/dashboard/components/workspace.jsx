import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { supabase } from "../../../services/supabaseClient.js";
import { Link } from "react-router-dom";

import { getFromSupabase } from "@/utils/getFromSupabase.js";
import { useSelector } from "react-redux";

const Workspace = () => {
  const { session } = useSelector((state) => state.auth);
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
  const fetchWorkspaces = async () => {
    const res = await getFromSupabase(
      "workspaces",
      ["workspace_name", "id"],
      "",
      ""
    );
    console.log(res.data);
    setAllworkspace(res.data);
    console.log(allworkspace);
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
      <div className="flex w-full h-full flex-col gap-4">
        {allworkspace.map((w, i) => (
          <div className="flex w-full px-4 m-auto justify-between items-center">
            <div className="flex gap-1.5">
              <img
                className="w-16 h-16"
                src="https://mudarisacademy.com/assets/mudarisLogo-uXFNaSVO.png"
                alt="workspace logo"
              />
              <div className="flex flex-col gap-2">
                <p className="text-l font-medium capitalize">
                  {w.workspace_name}
                </p>
                <div className="flex gap-3 items-center">
                  <div class="flex -space-x-4 rtl:space-x-reverse">
                    <img
                      class="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
                      src="https://i.pravatar.cc/40?img=1"
                      alt="User 1"
                    />
                    <img
                      class="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
                      src="https://i.pravatar.cc/40?img=2"
                      alt="User 2"
                    />
                    <img
                      class="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
                      src="https://i.pravatar.cc/40?img=3"
                      alt="User 3"
                    />
                    <img
                      class="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
                      src="https://i.pravatar.cc/40?img=4"
                      alt="User 4"
                    />
                  </div>

                  <p className="font-light text-gray-500 text-sm">
                    100 Members
                  </p>
                </div>
              </div>
            </div>
            <Link
              key={i}
              to={`/workspace/${w.id}`}
              style={{ textDecoration: "none" }}
            >
              <button className="bg-[#4d3763] font-semibold py-2 px-4 rounded-sm text-amber-50">
                {" "}
                Launch Workspace{" "}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Workspace;
