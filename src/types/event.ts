export interface IEventProps {
  id: string;
  title: string;
  metadata: Record<string, string>;
  when: {
    startTime: number;
    endTime: number;
  };
  conferencing: {
    details: {
      url: string;
    };
  };
  participants: {
    name: string;
  }[];
}
