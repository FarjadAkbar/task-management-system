"use client";
import { toast } from "@/hooks/use-toast";
import SuspenseLoading from "@/components/loadings/suspense";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "@/components/modals/delete-confitmation";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Edit, Eye, MoreVertical } from "lucide-react";
import { useDeleteToolMutation, useGetToolsQuery } from "@/service/tools";
import EditToolDialog from "./edit-tool";
import { ToolType } from "@/service/tools/type";
import AdminWrapper from "../admin-wrapper";

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
    <main className="min-h-screen mx-auto px-4 sm:px-8 py-6 bg-white">
      <h2 className="text-3xl mb-10 text-center font-extrabold text-gray-900 tracking-tight transition-all duration-500">
        Paid Tools By DolceFrutti
      </h2>

      <Card className="mb-12 bg-white/50 backdrop-blur-md border-gold/25 shadow-[0_8px_28px_rgba(0,0,0,0.1)] w-full">
        <CardContent className="pt-6 relative">
          {/* Glass Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/15 to-transparent opacity-0 hover:opacity-60 transition-opacity duration-600" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
              For Better Implementation and Efficiency
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              To support your work and ensure smooth operations, Dolce Frutti provides access to essential tools. Please
              read the following guidelines to maintain security and compliance.
            </p>

            <Alert className="mb-4 bg-white/80 border-gold/30 text-gray-900 rounded-lg transition-all duration-400 hover:bg-white/90">
              <AlertCircle className="h-4 w-4 text-gold transition-transform duration-400 group-hover:scale-110" />
              <AlertTitle className="text-gold font-semibold">Important Notes</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4 space-y-2 mt-2 text-gray-700">
                  <li>All tools and accounts provided by Dolce Frutti are strictly for company use.</li>
                  <li>These tools are licensed and paid by the company. Misuse may result in penalties.</li>
                  <li>Ensure that you log out after using shared accounts.</li>
                  <li>You are responsible for any activity under your access.</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {isPending ? (
        <SuspenseLoading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className="group bg-white/25 backdrop-blur-xl border-gold/25 overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.15)] rounded-xl transition-all duration-600 hover:-translate-y-3 hover:scale-105"
            >
              <CardHeader className="relative pb-0 pt-6">
                <AdminWrapper>
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-black hover:scale-110 transition-all duration-300"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white border-gold/30 text-black rounded-lg"
                      >
                        <DropdownMenuItem
                          onClick={() => handleEditClick(tool)}
                          className="focus:bg-gold/10 transition-colors duration-200"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gold/30" />
                        <DeleteConfirmationDialog name={tool.name} onDelete={() => onDelete(tool.id)} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </AdminWrapper>

                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-white/30 border border-gold/30 flex items-center justify-center transition-transform duration-600 group-hover:scale-115 ">
                    <Image
                      src={tool.document.document_file_url || "/placeholder.svg?height=96&width=96"}
                      alt={tool.name || "Tool Image"}
                      width={96}
                      height={96}
                      className="object-contain"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-3 text-center">
                <h3 className="font-bold text-lg text-black transition-colors duration-400 tracking-tight">
                  {tool.name}
                </h3>
              </CardContent>

              <CardFooter className="flex flex-col space-y-2 pt-0">
                <div className="w-full py-2 px-3 rounded-md bg-white/20 border border-gold/20 text-sm transition-all duration-400 group-hover:bg-white/30 group-hover:border-gold/40">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-black transition-colors duration-400">
                      User Email:
                    </span>
                    <Button
                      className="bg-white/50 border-gold/30 text-gold hover:bg-gold hover:text-black font-semibold rounded-lg h-8 transition-all duration-400 hover:scale-105"
                      size="sm"
                      onClick={() => handleCopy(tool.username)}
                    >
                      Copy User Email
                    </Button>
                  </div>
                </div>
                <div className="w-full py-2 px-3 rounded-md bg-white/20 border border-gold/20 text-sm transition-all duration-400 group-hover:bg-white/30 group-hover:border-gold/40">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-black transition-colors duration-400">
                      Password:
                    </span>
                    <Button
                      className="bg-white/50 border-gold/30 text-gold hover:bg-gold hover:text-black font-semibold rounded-lg h-8 transition-all duration-400 hover:scale-105"
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
      )}
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