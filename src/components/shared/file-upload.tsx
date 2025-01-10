import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  category: "image" | "pdf" | "audio";
  className?: string;
  accept?: string;
}

export function FileUpload({
  value,
  onChange,
  category,
  className,
  accept,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);
  
        // Create form data for server upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);
        formData.append("contentType", file.type);

        // Upload via our API endpoint
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.error || "Failed to upload file");
        }

        const { fileUrl } = await uploadResponse.json();
        onChange?.(fileUrl);
        toast.success("File uploaded successfully");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to upload file");
        // Clear the field value on error
        onChange?.("");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [category, onChange]
  );

  const acceptedTypes = {
    image: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    pdf: { 'application/pdf': ['.pdf'] },
    audio: { 'audio/*': ['.mp3', '.wav', '.mpeg'] }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || acceptedTypes[category],
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-4 transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        {uploading ? (
          <div className="w-full space-y-2">
            <div className="text-sm text-muted-foreground">Uploading...</div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : value ? (
          <div className="space-y-2 w-full">
            {category === "image" ? (
              <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-lg">
                <img
                  src={value}
                  alt="Uploaded file"
                  className="object-cover w-full h-full"
                />
              </div>
            ) : category === "pdf" && value ? (
              <div className="flex items-center justify-center w-full h-24 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">
                  PDF file uploaded
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-24 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">
                  File uploaded
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Click or drag to replace
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {isDragActive ? (
                "Drop it here!"
              ) : (
                <>
                  Click or drag{" "}
                  {category === "image"
                    ? "an image"
                    : category === "pdf"
                    ? "a PDF"
                    : "an audio file"}{" "}
                  to upload
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {category === "image"
                ? "JPG, PNG, WebP up to 5MB"
                : category === "pdf"
                ? "PDF up to 50MB"
                : "MP3, WAV up to 100MB"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
