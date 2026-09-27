export interface ProjectResult {
  value: string;
  label: string;
}

export interface ProjectData {
  id: string;
  name: string;
  aboutTitle: string;
  description: string;
  role: string;
  done: string[];
  results: ProjectResult[];
  stack: string;
  screenshots: string[];
  color: string;
  mainImage: string;
}
