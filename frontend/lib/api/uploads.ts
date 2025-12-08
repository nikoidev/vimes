import axiosInstance from "../axios";

export interface UploadedFile {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  folder: string;
  uploaded_by: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface UploadedFilesResponse {
  files: UploadedFile[];
  total: number;
  skip: number;
  limit: number;
}

const uploadsApi = {
  /**
   * Upload a file
   */
  upload: async (file: File, folder: string): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<UploadedFile>(
      `/uploads/?folder=${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Get files by folder
   */
  getByFolder: async (
    folder: string,
    skip = 0,
    limit = 100
  ): Promise<UploadedFilesResponse> => {
    const response = await axiosInstance.get<UploadedFilesResponse>(
      `/uploads/${folder}?skip=${skip}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Get file info by ID
   */
  getById: async (fileId: number): Promise<UploadedFile> => {
    const response = await axiosInstance.get<UploadedFile>(
      `/uploads/file/${fileId}`
    );
    return response.data;
  },

  /**
   * Delete a file
   */
  delete: async (fileId: number, permanent = false): Promise<void> => {
    await axiosInstance.delete(`/uploads/${fileId}?permanent=${permanent}`);
  },

  /**
   * Get file URL
   */
  getFileUrl: (filePath: string): string => {
    // Remover /api del NEXT_PUBLIC_API_URL para las imágenes
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const baseUrl = apiUrl.replace(/\/api$/, '');
    
    // Si el filePath no comienza con uploads/, agregarlo
    let path = filePath;
    if (!path.startsWith('uploads/') && !path.startsWith('/uploads/')) {
      path = `uploads/${path}`;
    }
    
    // Asegurar que el path comienza con /
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    
    return `${baseUrl}${path}`;
  },
};

export default uploadsApi;
