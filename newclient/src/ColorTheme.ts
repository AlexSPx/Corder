import { ThemeInterface } from "./Interfaces";

export const Light = {
  background: {
    light: "bg-gray-100",
    darker: "bg-gray-200",
    main: "bg-white",
    body: "bg-gray-50",
    contrast: "bg-indigo-600",
  },
  buttonColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
  text: {
    main: "text-black",
    secondary: "text-gray-500",
  },
  border: "border-gray-200",
  profile: "border-indigo-300",
} as ThemeInterface;

export const Dark = {
  background: {
    light: "bg-gray-700",
    darker: "bg-gray-900",
    main: "bg-gray-800",
    body: "bg-gray-900",
    contrast: "bg-indigo-800",
  },
  buttonColor: "bg-indigo-800 hover:bg-indigo-900 text-white",
  text: {
    main: "text-white",
    secondary: "text-gray-500",
  },
  border: "border-gray-700",
  profile: "border-gray-900",
} as ThemeInterface;
