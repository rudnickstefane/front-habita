import { Box, Button, Typography } from "@mui/material";
import { ChangeEvent, DragEvent, useRef, useState } from "react";

type PhotosDropzoneProps = {
  files: File[];
  onChange: (files: File[]) => void;
  minFiles?: number;
};

export default function PhotosDropzone({
  files,
  onChange,
  minFiles = 2,
}: PhotosDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function mergeFiles(incoming: File[]) {
    const images = incoming.filter((file) => file.type.startsWith("image/"));
    const existingKeys = new Set(files.map((file) => `${file.name}-${file.size}`));
    const next = [
      ...files,
      ...images.filter((file) => !existingKeys.has(`${file.name}-${file.size}`)),
    ];
    onChange(next);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    mergeFiles(Array.from(event.dataTransfer.files));
  }

  function handleSelect(event: ChangeEvent<HTMLInputElement>) {
    mergeFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function removeFile(index: number) {
    onChange(files.filter((_, current) => current !== index));
  }

  return (
    <Box className="flex flex-col gap-3">
      <Box
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${
          isDragging
            ? "border-[#1f6f5b] bg-[#1f6f5b]/10"
            : "border-[#cbbba8] bg-[#fbf7f2]"
        }`}
      >
        <Typography fontWeight={600}>Solte as fotos aqui</Typography>
        <Typography color="text.secondary" variant="body2" className="mt-1">
          Ou clique para selecionar. Mínimo de {minFiles} imagens (JPG, PNG, WEBP ou GIF).
        </Typography>
        <Button
          variant="outlined"
          className="mt-3 normal-case"
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Escolher fotos
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          onChange={handleSelect}
        />
      </Box>

      {files.length > 0 && (
        <Box className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {files.map((file, index) => (
            <Box key={`${file.name}-${index}`} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-28 w-full object-cover rounded-lg border border-[#e4d9cc]"
              />
              <Button
                size="small"
                color="error"
                className="!absolute top-1 right-1 min-w-0 px-2 bg-white/90"
                onClick={() => removeFile(index)}
              >
                ×
              </Button>
            </Box>
          ))}
        </Box>
      )}

      <Typography variant="caption" color={files.length < minFiles ? "error" : "text.secondary"}>
        {files.length} foto(s) selecionada(s). {files.length < minFiles ? `Faltam ${minFiles - files.length}.` : ""}
      </Typography>
    </Box>
  );
}
