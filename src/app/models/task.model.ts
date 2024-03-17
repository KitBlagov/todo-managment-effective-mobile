export interface Task {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  priority: string;
  status: string;
  executor: string;
}
