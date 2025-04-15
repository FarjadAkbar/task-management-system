// components/ui/EditableField.tsx
"use client";

import { useState } from "react";

interface EditableFieldProps {
    field: string;
    value: string;
    onSave: (field: string, value: string) => void;
    displayClassName?: string;
    inputClassName?: string;
    asTextarea?: boolean;
}

export function EditableField({
    field,
    value,
    onSave,
    displayClassName = "",
    inputClassName = "",
    asTextarea = false,
}: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const handleBlur = () => {
        onSave(field, inputValue);
        setIsEditing(false);
    };

    const Component = asTextarea ? "textarea" : "input";

    return isEditing ? (
        <Component
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && handleBlur()}
            autoFocus
            className={inputClassName}
        />
    ) : (
        <span
            onClick={() => setIsEditing(true)}
            className={`cursor-pointer hover:bg-gray-100 p-1 rounded ${displayClassName}`}
        >
            {value}
        </span>
    );
}