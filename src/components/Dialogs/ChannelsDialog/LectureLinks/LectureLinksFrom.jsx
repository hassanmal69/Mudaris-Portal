import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import {
  createLecturesLink,
  updateLecturesLink,
} from "@/redux/features/lecturesLink/lecturesLinksSlice";
import { useParams } from "react-router-dom";
import { addToast } from "@/redux/features/toast/toastSlice";

const URL_REGEX =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

const LectureLinksFrom = ({ onClose, lecturesLink }) => {
  const { workspace_id } = useParams();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: lecturesLink?.title || "",
    description: lecturesLink?.description || "",
    topic: lecturesLink?.tag || "",
    lectureLink: lecturesLink?.lecture_link || "",
  });
  const [linkError, setLinkError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate URL for lectureLink field
    if (name === "lectureLink" && value) {
      if (!URL_REGEX.test(value)) {
        setLinkError("Please enter a valid URL (e.g., https://example.com)");
      } else {
        setLinkError("");
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate lectureLink before submitting
    if (formData.lectureLink && !URL_REGEX.test(formData.lectureLink)) {
      setLinkError("Please enter a valid URL");
      return;
    }

    if (lecturesLink) {
      dispatch(
        updateLecturesLink({
          id: lecturesLink.id,
          updates: {
            title: formData.title,
            description: formData.description,
            tag: formData.topic,
            lecture_link: formData.lectureLink,
            workspace_id,
          },
        })
      );

      console.log(workspace_id, "ws id");
      dispatch(
        addToast({
          message: "Lecture link updated successfully!",
          type: "success",
          duration: 3000,
        })
      );
    } else {
      dispatch(
        createLecturesLink({
          title: formData.title,
          description: formData.description,
          tag: formData.topic,
          lecture_link: formData.lectureLink,
          workspace_id,
        })
      );
      dispatch(
        addToast({
          message: "Lecture link added successfully!",
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
      name: "topic",
      label: "Topic",
      type: "input",
      placeholder: "crypto",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Join us for a live Q&A session this Friday at 3 PM.",
      required: true,
    },
    {
      name: "lectureLink",
      label: "Lecture Link",
      type: "input",
      inputType: "url",
      placeholder: "https://www.zoom.link.com",
      required: true,
    },
  ];

  const renderField = (field) => {
    const commonLabelClasses = "text-(--muted-foreground) text-[14px]";
    const commonInputClasses =
      "w-full p-2 border rounded-md border-(--border) outline-0";
    const errorClasses =
      linkError && field.name === "lectureLink" ? "border-red-500" : "";

    return (
      <div key={field.name} className="flex flex-col gap-0.5">
        <label className={commonLabelClasses}>{field.label}</label>
        {field.type === "input" && (
          <>
            <Input
              type={field.inputType || "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              className={`${commonInputClasses} ${errorClasses}`}
            />
            {field.name === "lectureLink" && linkError && (
              <span className="text-red-500 text-[12px]">{linkError}</span>
            )}
          </>
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
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      {fields.map(renderField)}
      <div className="flex justify-between mt-4">
        <Button type="button" onClick={onClose} className="bg-red-700">
          Cancel
        </Button>
        <Button type="submit" className="bg-green-500">
          Add Announcement
        </Button>
      </div>
    </form>
  );
};

export default LectureLinksFrom;
