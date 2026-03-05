export interface DiaryEntry {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export interface ContextType {
    diaryEntries: DiaryEntry[];
    setId: (id: number) => void;
}