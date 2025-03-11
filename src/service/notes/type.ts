export type CreateNotePayloadType = {
  title: string;
  content: string;
  visibility: "shared" | "private";
};
