export interface AllJobsArgs {
  [key: string]: boolean;
}

interface Coordinates {
  lowerLeft: string[];
  upperRight: string[];
}

export interface JobBody {
  initialDate: Date;
  finalDate: Date;
  priority: number;
  inputGatheringTag: string;
  inputPreprocessingTag: string;
  inputProcessingTag: string;
  userEmail: string;
  userPass: string;
  label: string;
  email: string;
  coordinates: Coordinates;
}
