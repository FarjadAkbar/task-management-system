import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon } from "lucide-react"

interface TaskFeedbackFormProps {
  onSubmit: (feedback: string, rating: number) => void
}

export function TaskFeedbackForm({ onSubmit }: TaskFeedbackFormProps) {
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(feedback, rating)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
          Feedback
        </label>
        <Textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <div className="flex items-center mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-6 h-6 cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <Button type="submit">Submit Feedback</Button>
    </form>
  )
}

