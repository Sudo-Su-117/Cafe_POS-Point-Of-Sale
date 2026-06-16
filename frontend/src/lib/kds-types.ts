export type KDSStage = "to-cook" | "preparing" | "ready";

export type KDSFilterStage = "all" | KDSStage;

export type KDSViewMode = "kanban" | "grid";

export type KDSSortMode = "elapsed" | "table" | "order";

export type KDSTimerUrgency = "normal" | "warning" | "danger";

export type KDSStation = "all" | "kitchen" | "beverage" | "bakery";

export interface KDSItem {
  id: number;
  name: string;
  quantity: number;
  done: boolean;
  station: "kitchen" | "beverage" | "bakery";
}

export interface KDSOrder {
  id: string;
  table: string;
  stage: KDSStage;
  items: KDSItem[];
  elapsed: number;
  note?: string;
}

export function getItemStation(itemName: string): "kitchen" | "beverage" | "bakery" {
  const name = itemName.toLowerCase();
  if (
    name.includes("white") ||
    name.includes("americano") ||
    name.includes("cappuccino") ||
    name.includes("latte") ||
    name.includes("espresso") ||
    name.includes("brew") ||
    name.includes("tea") ||
    name.includes("shake") ||
    name.includes("smoothie") ||
    name.includes("coffee")
  ) {
    return "beverage";
  }
  if (
    name.includes("croissant") ||
    name.includes("muffin") ||
    name.includes("bread") ||
    name.includes("cake") ||
    name.includes("pastry") ||
    name.includes("cookie") ||
    name.includes("roll") ||
    name.includes("danish")
  ) {
    return "bakery";
  }
  return "kitchen";
}

export const KDS_STAGE_LABELS: Record<KDSStage, string> = {
  "to-cook": "To Cook",
  preparing: "Preparing",
  ready: "Ready",
};

export const KDS_STAGES: KDSStage[] = ["to-cook", "preparing", "ready"];

export function columnIdFromStage(stage: KDSStage): string {
  return `column-${stage}`;
}

export function stageFromColumnId(id: string): KDSStage | null {
  if (id === "column-to-cook") return "to-cook";
  if (id === "column-preparing") return "preparing";
  if (id === "column-ready") return "ready";
  return null;
}

export const TIMER_WARNING_MINUTES = 8;
export const TIMER_DANGER_MINUTES = 12;

export function getTimerUrgency(elapsed: number): KDSTimerUrgency {
  if (elapsed >= TIMER_DANGER_MINUTES) return "danger";
  if (elapsed >= TIMER_WARNING_MINUTES) return "warning";
  return "normal";
}

export function sortOrders(orders: KDSOrder[], mode: KDSSortMode): KDSOrder[] {
  const sorted = [...orders];
  switch (mode) {
    case "elapsed":
      return sorted.sort((a, b) => b.elapsed - a.elapsed);
    case "table":
      return sorted.sort((a, b) => a.table.localeCompare(b.table));
    case "order":
      return sorted.sort((a, b) => a.id.localeCompare(b.id));
    default:
      return sorted;
  }
}
