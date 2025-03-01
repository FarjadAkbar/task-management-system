export interface IFilterConfig {
  name: string;
  label: string;
  options?: { label: string; value: string }[];
  isInput?: boolean;
}