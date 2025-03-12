import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { File, FileImage, FileText, FileAudio, FileVideo, FileIcon as FilePdf } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomPassword() {
  const length = 10;
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numericChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-={}[];',./<>?~`|:\"\\";

  let password = "";

  // Add one uppercase letter
  password += uppercaseChars.charAt(
    Math.floor(Math.random() * uppercaseChars.length)
  );

  // Add one numeric digit
  password += numericChars.charAt(
    Math.floor(Math.random() * numericChars.length)
  );

  // Add at least one special character
  password += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );

  // Add remaining characters randomly
  const remainingChars =
    uppercaseChars + uppercaseChars.toLowerCase() + numericChars + specialChars;
  for (let i = 3; i < length; i++) {
    password += remainingChars.charAt(
      Math.floor(Math.random() * remainingChars.length)
    );
  }

  // Shuffle the password to make it more random
  password = password
    .split("")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join("");

  return password;
}

export function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return FileImage
  if (fileType.startsWith("audio/")) return FileAudio
  if (fileType.startsWith("video/")) return FileVideo
  if (fileType === "application/pdf") return FilePdf
  if (fileType.startsWith("text/")) return FileText
  return File
}


export function previewFile(file: { document_file_url: string; document_file_mimeType: string }) {
  if (file.document_file_mimeType.startsWith("image/")) {
    window.open(file.document_file_url, "_blank")
  } else {
    // For non-image files, you might want to use a more sophisticated preview method
    // This is a simple fallback that will attempt to open the file in a new tab
    window.open(file.document_file_url, "_blank")
  }
}



export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

