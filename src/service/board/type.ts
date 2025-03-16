// types.ts
import type { Boards, Sections, Tasks } from "@prisma/client";


export type SectionType = Sections & {
  tasks: Tasks[]
}

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
