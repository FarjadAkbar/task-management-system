"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FilesFilterProps {
  onFilterChange: (filters: {
    search: string
    type: string
    sortBy: string
    sortOrder: "asc" | "desc"
  }) => void
}

export function FilesFilter({ onFilterChange }: FilesFilterProps) {
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange({ search: e.target.value, type, sortBy, sortOrder })
  }

  const handleTypeChange = (value: string) => {
    setType(value)
    onFilterChange({ search, type: value, sortBy, sortOrder })
  }

  const handleSortByChange = (value: string) => {
    setSortBy(value)
    onFilterChange({ search, type, sortBy: value, sortOrder })
  }

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value)
    onFilterChange({ search, type, sortBy, sortOrder: value })
  }

  const handleClearFilters = () => {
    setSearch("")
    setType("")
    setSortBy("createdAt")
    setSortOrder("desc")
    onFilterChange({ search: "", type: "", sortBy: "createdAt", sortOrder: "desc" })
    setIsFilterOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search files..." className="pl-8" value={search} onChange={handleSearchChange} />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-7 w-7"
            onClick={() => {
              setSearch("")
              onFilterChange({ search: "", type, sortBy, sortOrder })
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Filter & Sort</h4>

            <div className="space-y-2">
              <Label>File Type</Label>
              <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All file types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All file types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="pdf">PDF Documents</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
                  <SelectItem value="presentation">Presentations</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="archive">Archives</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={handleSortByChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Date created" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date created</SelectItem>
                  <SelectItem value="document_name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort Order</Label>
              <RadioGroup value={sortOrder} onValueChange={handleSortOrderChange as any}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="desc" id="desc" />
                  <Label htmlFor="desc">Descending</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asc" id="asc" />
                  <Label htmlFor="asc">Ascending</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
              <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

