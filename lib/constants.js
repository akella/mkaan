import { CustomEase } from "gsap/CustomEase";
import { gsap } from "gsap";
gsap.registerPlugin(CustomEase);
CustomEase.create("CubicMid", "0.25,0.1 0.25,1");

export const CURSOR_DOT_MOVE_EVENT = "cursor-dot-move";
export const PROJECT_FILTER_CHANGE_EVENT = "projects-filter-change";
export const PROJECT_FILTER_UPDATED_EVENT = "projects-filter-updated";
