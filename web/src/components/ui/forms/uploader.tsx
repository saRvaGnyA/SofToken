/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '@/components/ui/button';

function Uploader({ files, setFiles }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept:
      'application/zip, application/x-zip-compressed, multipart/x-zip, application/x-7z-compressed, application/x-bzip, application/x-bzip2, application/gzip',
    multiple: false,
    onDrop: (acceptedFiles: any) => {
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file: any) => (
    <div key={file.name} className="h-full w-full p-12 text-center">
      <p className="mb-6 text-sm tracking-tighter text-gray-600 dark:text-gray-400">
        {file.name}
      </p>
      <p className="mb-6 text-sm tracking-tighter text-gray-600 dark:text-gray-400">
        {file.size} bytes
      </p>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, [files]);

  console.log(files);

  return (
    <div className="rounded-lg border border-solid border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-light-dark sm:p-6">
      <div
        {...getRootProps({
          className:
            'border border-dashed relative border-gray-200 dark:border-gray-700 h-48 flex items-center justify-center rounded-lg',
        })}
      >
        <input {...getInputProps()} />
        {files.length > 0 ? (
          thumbs
        ) : (
          <div className="text-center">
            <p className="mb-6 text-sm tracking-tighter text-gray-600 dark:text-gray-400">
              ZIPPED/COMPRESSED ARCHIVE Files ONLY
            </p>
            <Button>CHOOSE FILE</Button>
          </div>
        )}
      </div>
    </div>
  );
}
export default Uploader;
