import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Attachment {
  _id?: string;
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
  uploaded?: boolean;
  fileId?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  filename?: string;
  mimetype?: string;
}

interface TaskAttachmentsProps {
  taskId: string;
  userId: string; // Add userId prop
}

export default function TaskAttachments({ taskId, userId }: TaskAttachmentsProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentUploads, setRecentUploads] = useState<string[]>([]); // Track uploads from current session

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };



  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploaded: false,
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    event.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleUploadAttachment = async (attachment: Attachment) => {
    if (!attachment.file || userId === "" || !taskId) return;

    setUploading(prev => [...prev, attachment.id]);

    try {
      const formData = new FormData();
      formData.append('file', attachment.file);
      formData.append('taskId', taskId);
      formData.append('userId', userId);
      formData.append('fileId', attachment.id)

      const response = await fetch('/api/attachments/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();

      setAttachments(prev =>
        prev.map(att =>
          att.id === attachment.id
            ? {
              ...att,
              file: undefined,
              uploaded: true,
              fileId: result.fileId,
              name: result.filename
            }
            : att
        )
      );

      // ADD to recent uploads
      setRecentUploads(prev => [...prev, attachment.id]);

    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(prev => prev.filter(id => id !== attachment.id));
    }
  };


  const handleDownloadAttachment = (attachment: Attachment) => {
    if (!attachment.id) return;

    window.open(`/api/attachments/download/${attachment.fileId}`, '_blank');
  };

  const handleDeleteAttachment = async (attachment: Attachment) => {
    if (!attachment.fileId) return;

    try {
      const response = await fetch(`/api/attachments/delete/${attachment.fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      // Remove from local state using fileId instead of id
      setAttachments(prev => prev.filter(att => att.fileId !== attachment.fileId));

    } catch (error) {
      console.error('Delete error:', error);
    }
  }


  useEffect(() => {
    const loadExistingAttachments = async () => {
      try {
        const response = await fetch(`/api/attachments/${taskId}`);
        if (!response.ok) throw new Error('Failed to load attachments');

        const data = await response.json();
        const existingAttachments: Attachment[] = data.attachments.map((att: Attachment) => ({
          id: att._id,
          name: att.filename,
          size: att.size,
          type: att.mimetype,
          uploaded: true,
          fileId: att.fileId,
        }));
        console.log("EXISTING ATTACHMENTS: ", existingAttachments);
        setAttachments(existingAttachments);
      } catch (error) {
        console.error('Error loading attachments:', error);
      } finally {
        setLoading(false);
      }
    };
    loadExistingAttachments();
  }, [taskId]);

  if (loading) {
    return <div>Loading attachments...</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Attachments
      </label>

      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id={`file-upload-${taskId}`}
      />

      <button
        type="button"
        onClick={() => document.getElementById(`file-upload-${taskId}`)?.click()}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        Add Attachment
      </button>

      {attachments.length > 0 && (
        <div className="mt-4 space-y-2">
          {attachments.map((attachment) => (
            <div key={attachment.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-400">📄</div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {attachment.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(attachment.size)}
                    {recentUploads.includes(attachment.id) && (
                      <span className="ml-2 text-green-600">✓ Uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {attachment.id && (
                  <button
                    type="button"
                    onClick={() => handleDownloadAttachment(attachment)}
                    className="text-blue-600 hover:text-blue-800 text-lg"
                  >
                    ⬇️
                  </button>
                )}

                {attachment.file && !attachment.uploaded && (
                  <button
                    type="button"
                    onClick={() => handleUploadAttachment(attachment)}
                    disabled={uploading.includes(attachment.id)}
                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {uploading.includes(attachment.id) ? '...' : 'Upload'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (attachment.fileId) {
                      handleDeleteAttachment(attachment);
                    } else {
                      handleRemoveAttachment(attachment.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}