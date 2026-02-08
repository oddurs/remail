import { PEOPLE_CONTACTS } from "./people";
import { WORK_CONTACTS } from "./work";
import { SERVICE_CONTACTS } from "./services";
import { COMMERCE_CONTACTS } from "./commerce";
import { NEWSLETTER_CONTACTS } from "./newsletters";
import type { ContactTemplate } from "../../types";

export const ALL_CONTACTS: ContactTemplate[] = [
  ...PEOPLE_CONTACTS,
  ...WORK_CONTACTS,
  ...SERVICE_CONTACTS,
  ...COMMERCE_CONTACTS,
  ...NEWSLETTER_CONTACTS,
];
