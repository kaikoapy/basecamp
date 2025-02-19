/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ads from "../ads.js";
import type * as announcements from "../announcements.js";
import type * as dealer_info from "../dealer_info.js";
import type * as directory from "../directory.js";
import type * as files from "../files.js";
import type * as position_config from "../position_config.js";
import type * as resources from "../resources.js";
import type * as schedule from "../schedule.js";
import type * as shifts from "../shifts.js";
import type * as types from "../types.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ads: typeof ads;
  announcements: typeof announcements;
  dealer_info: typeof dealer_info;
  directory: typeof directory;
  files: typeof files;
  position_config: typeof position_config;
  resources: typeof resources;
  schedule: typeof schedule;
  shifts: typeof shifts;
  types: typeof types;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
