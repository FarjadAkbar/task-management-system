"use client"
import { toast } from "@/hooks/use-toast";
import SuspenseLoading from "@/components/loadings/suspense";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "@/components/modals/delete-confitmation";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Edit, Eye, MoreVertical } from "lucide-react";
import { useDeleteToolMutation, useGetToolsQuery } from "@/service/tools";
import EditToolDialog from "./edit-tool";
import { ToolType } from "@/service/tools/type";

const AllTools = () => {
  const [pageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { data, isPending } = useGetToolsQuery({ pageSize, pageNumber });
  const tools = data?.tools || [];

  const { mutate, isPending: isLoading } = useDeleteToolMutation();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);

  const onDelete = (toolId: string) => {
    mutate(toolId, {
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleCopy = (text: string, isPassword = false) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: isPassword ? `Password copied to clipboard: ${"*".repeat(text.length)}` : `Copied: ${text}`,
    });
  };

  const handleEditClick = (tool: ToolType) => {
    setSelectedTool(tool);
    setEditModalOpen(true);
  };

  return (
    <main className="min-h-screen mx-auto px-4 sm:px-8 py-6">
      <h2 className="text-3xl mb-8 text-center font-bold text-gray-800">Paid Tools By DolceFrutti</h2>

      <Card className="max-w-3xl mx-auto mb-12 shadow-lg rounded-xl bg-white border-0">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">For Better Implementation and Efficiency</h2>
          <p className="text-muted-foreground mb-6">
            To support your work and ensure smooth operations, Dolce Frutti provides access to essential tools. Please
            read the following guidelines to maintain security and compliance.
          </p>

          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important Notes</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4 space-y-2 mt-2 ">
                <li>All tools and accounts provided by Dolce Frutti are strictly for company use.</li>
                <li>These tools are licensed and paid by the company. Misuse may result in penalties.</li>
                <li>Ensure that you log out after using shared accounts.</li>
                <li>You are responsible for any activity under your access.</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {isPending ? <SuspenseLoading />
        :

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-10">
          {tools.map((tool) => (
            <Card key={tool.id} className=" bg-white border-0 group overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-lg rounded-xl">
              <CardHeader className="relative pb-0 pt-6">
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(tool)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DeleteConfirmationDialog name={tool.name} onDelete={() => onDelete(tool.id)} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center transition-transform group-hover:scale-105">
                    <Image
                      src={tool.document.document_file_url || "/placeholder.svg?height=96&width=96"}
                      alt={tool.name || "Tool Image"}
                      width={96}
                      height={96}
                      className="object-fit"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-3 text-center">
                <h3 className="font-bold text-lg mb-1">{tool.name}</h3>
              </CardContent>

              <CardFooter className="flex flex-col space-y-1 pt-0">
                <div className="w-full py-1 rounded-md bg-muted/50 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">User Email:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(tool.username)}
                    >
                      Copy User Email
                    </Button>
                  </div>
                </div>
                <div className="w-full rounded-md bg-muted/50 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Password:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(tool.password, true)}
                    >
                      Copy Password
                    </Button>

                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      }
      {/* Edit Tool Dialog */}
      {selectedTool && editModalOpen && (
        <EditToolDialog
          tool={selectedTool}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
        />
      )}
    </main>
  );
};

export default AllTools;
