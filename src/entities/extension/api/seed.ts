import records from "./data.json";
import { toExtension } from "../model/extensions";
import type { Extension } from "../model/types";

export const loadInitialExtensions = (base?: string): Extension[] =>
  records.map((record) => toExtension(record, base));
