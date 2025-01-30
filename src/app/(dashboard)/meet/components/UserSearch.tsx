"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UserSearch({ onSelectUser }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/users/search?term=${searchTerm}`)
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Error searching users:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {searchResults.length > 0 && (
        <ul className="border rounded-md divide-y">
          {searchResults.map((user) => (
            <li key={user.id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => onSelectUser(user)}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

