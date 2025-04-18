/**
 * The CustomAlert component is a React component that displays an error alert with a title,
 * description, and a close button.
 * @returns The CustomAlert component is being returned, which renders an Alert component from the
 * "@shadcn/ui" library with a specified status, title, description, and onClose handler.
 */
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";

const CustomAlert = ({ title, description, onClose }) => {
  return (
    <Alert onClose={onClose} className="">
      <X onClick={onClose} />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default CustomAlert;
