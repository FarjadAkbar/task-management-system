// types.ts
import type { Boards, Sections } from "@prisma/client";

export type BoardWithSectionsType = Boards & {
  sections: Sections[];
};

export type BoardPayloadType = {
  name: string;
  description?: string;
  projectId?: string;
};

export type SectionPayloadType = {
  name: string;
  color?: string;
  position?: number;
};
