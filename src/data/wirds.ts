import { wirdSections as makhouzWirds } from "./makhouzLitanies";
import { khadiryaWirds } from "./khadiryaWirds";
import { PROJECT } from "../config/app.config";

export const WIRDS = {
  makhouz: makhouzWirds,
  khadirya: khadiryaWirds,
};

export type ProjectKey = keyof typeof WIRDS;

export const ACTIVE_WIRDS = WIRDS[PROJECT as ProjectKey];