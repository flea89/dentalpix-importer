import React, { InputHTMLAttributes } from 'react';
import PropTypes from 'prop-types';

interface FilePickerOptions {
  onPickFiles: (files: File[]) => void;
}

export default function FilePicker({ onPickFiles }: FilePickerOptions) {
  function killEvent(e: Pick<Event, 'stopPropagation' | 'preventDefault'>) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  const onDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    return killEvent(e);
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    killEvent(e);
    onPickFiles(Array.from(e.dataTransfer.files));
  };
  const handleFilesChange = (e: React.ChangeEvent) => {
    const { files } = e.target as HTMLInputElement;
    if (files) {
      onPickFiles(Array.from(files));
    }
  };

  return (
    <label
      htmlFor="files"
      className="relative flex justify-center align-center pa3 grow b--dashed br2"
      onDragEnter={onDragEnter}
      onDragOver={killEvent}
      onDrop={handleDrop}
      draggable
    >
      <input
        id="files"
        type="file"
        className="dn"
        multiple
        /* @ts-expect-error directory not defined on HTMLInput */
        directory="true"
        onChange={handleFilesChange}
      />
      <div className="">
        Drag and Drop files
        <br />
        <span className="">(or click to choose)</span>
      </div>
    </label>
  );
}

FilePicker.propTypes = {
  onPickFiles: PropTypes.func.isRequired,
};
