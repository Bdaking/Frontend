import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
  LuStickyNote,
  LuBot,
  LuReceipt, // ← was missing, this caused the crash
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
  },
  {
    id: "04",
    label: "Notes",
    icon: LuStickyNote,
    path: "/notes",
  },
  {
    id: "05",
    label: "AI Chat",
    icon: LuBot,
    path: "/ai-chat",
  },
  {
    id: "06",
    label: "Receipts", // ← moved before Logout, fixed id
    icon: LuReceipt,
    path: "/receipts",
  },
  {
    id: "07", // ← was "06", now "07"
    label: "Logout",
    icon: LuLogOut,
    path: "/logout",
  },
];
