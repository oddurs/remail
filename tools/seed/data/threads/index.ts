import { PRIMARY_THREADS } from "./primary";
import { UPDATE_THREADS } from "./updates";
import { SOCIAL_THREADS } from "./social";
import { PROMOTION_THREADS } from "./promotions";
import { FORUM_THREADS } from "./forums";
import { SPECIAL_THREADS } from "./special";
import type { ThreadTemplate } from "../../types";

export const ALL_THREADS: ThreadTemplate[] = [
  ...PRIMARY_THREADS,
  ...UPDATE_THREADS,
  ...SOCIAL_THREADS,
  ...PROMOTION_THREADS,
  ...FORUM_THREADS,
  ...SPECIAL_THREADS,
];
