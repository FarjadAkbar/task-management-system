import axios from "axios";

//Actions
export const postTaskFeedback = async (taskId: string, feedback: string, rating: number) => {
  try {
    await axios.post('/api/projects/tasks/feedback', { taskId, feedback, rating });
  } catch (error) {
    console.log(error);
  }
};
