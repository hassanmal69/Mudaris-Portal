import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  createAnnouncementDB,
  updateAnnouncementDB,
} from "@/redux/features/announcements/announcementsSlice";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { useParams } from "react-router-dom";
import { addToast } from "@/redux/features/toast/toastSlice";
import HandleSupabaseLogicNotification from "@/layout/topbar/notification/handleSupabaseLogicNotification";

const PRIORITY_OPTIONS = [
  { value: "important", label: "Important" },
  { value: "update", label: "Update" },
  { value: "event", label: "Event" },
  { value: "info", label: "Info" },
];

const AnnouncementForm = ({ onClose, announcement }) => {
  const { workspace_id } = useParams();
  const dispatch = useDispatch();
  const { currentWorkspace } = useSelector(
    (state) => state.workSpaces
  )
  const [formData, setFormData] = useState({
    title: announcement?.title || "",
    description: announcement?.description || "",
    priority: announcement?.tag || "info",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (announcement) {
      // update existing announcement
      dispatch(
        updateAnnouncementDB({
          id: announcement.id,
          updates: {
            title: formData.title,
            description: formData.description,
            tag: formData.priority,
          },
        })
      );

      dispatch(
        addToast({
          message: "Announcement updated successfully!",
          type: "success",
          duration: 3000,
        })
      );
    } else {
      // create new announcement
      dispatch(
        createAnnouncementDB({
          title: formData.title,
          description: formData.description,
          tag: formData.priority,
          workspace_id,
        })
      );
      HandleSupabaseLogicNotification(
        'announcement',
        workspace_id,
        null,
        null,
        `New Announcement is added in  ${currentWorkspace?.workspace_name}`,
      )
      dispatch(
        addToast({
          message: "Announcement created successfully!",
          type: "success",
          duration: 3000,
        })
      );
    }
    onClose();
  };
  const fields = [
    {
      name: "title",
      label: "Title",
      type: "input",
      placeholder: "Live Q&A Session This Friday",
      required: true,
    },
    {
      name: "priority",
      label: "Priority Tag",
      type: "select",
      options: PRIORITY_OPTIONS,
      required: false,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Join us for a live Q&A session this Friday at 3 PM.",
      required: true,
    },
  ];

  const renderField = (field) => {
    const commonLabelClasses = "text-(--muted-foreground) text-[14px]";
    const commonInputClasses =
      "w-full p-2 border rounded-md border-(--border) outline-0";

    return (
      <div key={field.name} className="flex flex-col gap-0.5">
        <label className={commonLabelClasses}>{field.label}</label>
        {field.type === "input" && (
          <Input
            type="text"
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            className={commonInputClasses}
          />
        )}
        {field.type === "textarea" && (
          <Textarea
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            className={`${commonInputClasses} resize-none`}
          />
        )}
        {field.type === "select" && (
          <select
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className={commonInputClasses}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      {fields.map(renderField)}
      <div className="flex justify-between mt-4">
        <Button type="button" onClick={onClose} variant={"destructive"}>
          Cancel
        </Button>
        <Button type="submit" variant={"success"}>
          Add Announcement
        </Button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
