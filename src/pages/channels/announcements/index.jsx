import React, { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient.js";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import AddAnnouncementDialog from "@/components/add-announcement-dialog";

const Announcements = () => {
  const { session } = useSelector((state) => state.auth);
  const isAdmin = session?.user?.user_metadata?.user_role === "admin";

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching announcements:", error);
      else setAnnouncements(data);
      setLoading(false);
    };

    fetchAnnouncements();
  }, []);

  if (loading)
    return (
      <section className="flex justify-center items-center h-40 bg-(--background)">
        <p className="text-(--muted)">Loading announcements...</p>
      </section>
    );

  return (
    <section className="max-w-4xl mx-auto p-4 space-y-4 ">
      <div className="flex flex-col gap-0 items-center">
        <span className="bg-(--primary) text-(--foreground) w-[65px] rounded-md h-[65px] flex items-center justify-center mb-2">
          <Megaphone className="w-9 h-9" />
        </span>
        {isAdmin && (
          <Button
            variant="secondary"
            size="sm"
            className="text-(--muted-foreground) curson-pointer border"
            onClick={() => setDialogOpen(true)} // Open dialog on click
          >
            Add Announcement
          </Button>
        )}
        <h2 className="text-2xl text-(--foreground)">Academy Announcements</h2>
        <p className="text-(--muted-foreground)">
          Stay updated with the latest news, updates, and important information
        </p>
      </div>
      {announcements.length === 0 ? (
        <p className=" text-(--muted)">No announcements yet.</p>
      ) : (
        announcements.map((a) => (
          <div
            key={a.id}
            className="border border-(--border) gap-2 flex flex-col
            border-l-4 border-l-(--primary) rounded-2xl bg-(--card) p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col">
              <div className="flex  gap-2 items-center">
                <h3 className="text-lg text-(--foreground)">{a.title}</h3>
                <span
                  className={`px-2  text-[12px] py-1 
                    font-medium rounded-md capitalize text-(--primary-foreground) ${
                      a.tag === "important"
                        ? "bg-(--destructive) hover:bg-(--destructive)/90 focus-visible:ring-destructive/20  dark:focus-visible:ring-destructive/40 dark:bg-(--destructive)/60"
                        : a.tag === "update"
                          ? "bg-(--primary)"
                          : a.tag === "event"
                            ? "bg-green-600"
                            : "bg-(--muted)"
                    }`}
                >
                  {a.tag}
                </span>
              </div>
              <p className="text-sm text-(--muted-foreground)">
                {new Date(a.created_at).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <p className="mb-2 text-(--muted-foreground)">{a.description}</p>
          </div>
        ))
      )}
      <AddAnnouncementDialog open={dialogOpen} onOpenChange={setDialogOpen} />{" "}
      {/* Add the dialog component */}
    </section>
  );
};

export default Announcements;
