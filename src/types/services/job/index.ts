export interface AllJobsArgs {
  [key: string]: boolean;
}

interface Coordinates {
  lowerLeft: number[];
  upperRight: number[];
}

export interface JobBody {
  initialDate: string;
  finalDate: string;
  priority: number;
  inputGatheringTag: string;
  inputPreprocessingTag: string;
  algorithmExecutionTag: string;
  userEmail: string;
  userPass: string;
  label: string;
  email: string;
  coordinates: Coordinates;
}
