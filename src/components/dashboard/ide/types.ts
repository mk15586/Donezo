export type FileItem = {
    id: string;
    name: string;
    type: 'file' | 'folder';
    parentId: string | null;
    content?: string;
    language?: string;
};

export type FileSystemState = {
    files: FileItem[];
    openFiles: string[]; // array of file ids
    activeFileId: string | null;
};
