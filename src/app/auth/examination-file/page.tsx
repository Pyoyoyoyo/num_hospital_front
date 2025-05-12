'use client';

import { useState } from 'react';
import { uploadFile } from '@/services/file.service';

export default function FileUploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;
    setLoading(true);
    setError(null);

    try {
      const responses = await Promise.all(
        Array.from(selectedFiles).map((file) => uploadFile(file))
      );
      setUploadedUrls(responses.map((res) => res.data.url));
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Upload failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-xl bg-white rounded-xl shadow-lg p-6'>
        <h1 className='text-2xl font-semibold text-gray-800 mb-4'>
          📎 Файл байршуулах
        </h1>

        <label className='block mb-2 text-sm font-medium text-gray-700'>
          Сонгох файлууд (PDF)
        </label>
        <input
          type='file'
          multiple
          accept='application/pdf'
          onChange={handleFileChange}
          className='block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100'
        />

        {selectedFiles && (
          <ul className='mt-3 space-y-1 text-gray-600'>
            {Array.from(selectedFiles).map((file) => (
              <li key={file.name} className='flex items-center'>
                <svg
                  className='w-4 h-4 text-gray-500 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 16h8M8 12h8m-7-8h6l2 2h2a2 2 0 012 2v12a2 2 0
                       01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2l2-2z'
                  />
                </svg>
                {file.name}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !selectedFiles}
          className={`mt-4 w-full flex items-center justify-center py-2 px-4 text-white font-semibold rounded-lg transition-colors
            ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {loading ? (
            <svg
              className='animate-spin h-5 w-5 mr-2 text-white'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8v8H4z'
              />
            </svg>
          ) : null}
          {loading ? 'Илгээж байна…' : 'Илгээх'}
        </button>

        {error && <p className='mt-3 text-red-600 text-sm'>{error}</p>}

        {/* PDF Previews */}
        {uploadedUrls.length > 0 && (
          <div className='mt-6 space-y-6'>
            {uploadedUrls.map((url) => (
              <div key={url} className='bg-gray-100 rounded-lg shadow p-4'>
                <p className='mb-2'>
                  <a
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    View in new tab
                  </a>
                </p>
                <iframe
                  src={url}
                  width='100%'
                  height='400px'
                  className='rounded border'
                  title='PDF Preview'
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
