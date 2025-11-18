import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { createAnnouncement } from "@/redux/features/announcements/announcementsSlice";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";

const PRIORITY_OPTIONS = [
  { value: "important", label: "Important" },
  { value: "update", label: "Update" },
  { value: "event", label: "Event" },
  { value: "info", label: "Info" },
];

const AnnouncementForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "info",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createAnnouncement(formData));
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
            className={commonInputClasses}
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
        <Button type="button" onClick={onClose} className="bg-(--destructive)">
          Cancel
        </Button>
        <Button type="submit" className="bg-green-800">
          Add Announcement
        </Button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
