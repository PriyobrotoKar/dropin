import { defineRelations } from "drizzle-orm";
import * as schema from "./model";

export const relations = defineRelations(schema, (r) => ({
  files: {
    owner: r.one.users({
      from: r.files.ownerId,
      to: r.users.id,
      optional: false,
    }),
  },
}));
