export interface CancelEventFormProps {
    item: {
      id: string
      title: string;
      metadata: Record<string, string>
      when: {
        startTime: number
        endTime: number
      }
      conferencing: {
        details: {
          url: string
        }
      }
      participants: {
        name: string
      }[]
    }
  }