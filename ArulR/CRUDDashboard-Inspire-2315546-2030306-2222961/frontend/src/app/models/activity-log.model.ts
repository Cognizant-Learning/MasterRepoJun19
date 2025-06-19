export interface ActivityLog {
  id: number;
  action: string;
  itemId?: number;
  timestamp: Date;
}
