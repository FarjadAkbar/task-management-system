import { IChecklistItem } from "@/types/checklist";

  
  export const addChecklistItem = ({
    setChecklistItems,
    checklistItems,
  }: {
    setChecklistItems: React.Dispatch<React.SetStateAction<IChecklistItem[]>>;
    checklistItems: IChecklistItem[];
  }) => {
    setChecklistItems([
      ...checklistItems,
      { id: Date.now().toString(), text: "", checked: false },
    ]);
  };
  
  export const removeChecklistItem = ({
    setChecklistItems,
    checklistItems,
    id,
  }: {
    setChecklistItems: React.Dispatch<React.SetStateAction<IChecklistItem[]>>;
    checklistItems: IChecklistItem[];
    id: string;
  }) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };
  
  export const updateChecklistItem = ({
    setChecklistItems,
    checklistItems,
    id,
    text,
  }: {
    setChecklistItems: React.Dispatch<React.SetStateAction<IChecklistItem[]>>;
    checklistItems: IChecklistItem[];
    id: string;
    text: string;
  }) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, text } : item
      )
    );
  };
  