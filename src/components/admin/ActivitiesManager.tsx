import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, Activity, FileText, Video, Camera, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getActivities, deleteRecord } from "@/lib/db/queries";
import { activities } from "@/lib/db/schema";
import { ActivityFormModal } from "./ActivityFormModal";

// Define Activity type locally
interface Activity {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  videoId: string | null;
  photoId: string | null;
  tagId: string | null;
  sortOrder: number | null;
  active: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export const ActivitiesManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      return await getActivities();
    },
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      await deleteRecord(activities, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Activity deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete activity");
      console.error("Delete error:", error);
    },
  });

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      deleteActivity.mutate(id);
    }
  };

  const handleAddNew = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const filteredActivities = activities?.filter((activity) =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const totalActivities = activities?.length || 0;
  const activeActivities = activities?.filter(a => a.active)?.length || 0;
  const withSections = activities?.filter(a => a.section_id)?.length || 0;
  const withMedia = activities?.filter(a => a.video_id || a.photo_id)?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Activities Management</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Activity
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold">{totalActivities}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeActivities}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">With Sections</p>
                <p className="text-2xl font-bold text-purple-600">{withSections}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">With Media</p>
                <p className="text-2xl font-bold text-orange-600">{withMedia}</p>
              </div>
              <Camera className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Activities Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading activities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities?.map((activity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    {activity.subtitle && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(activity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(activity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {activity.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {activity.description}
                  </p>
                )}

                {/* Content Info */}
                <div className="space-y-2 mb-3">
                  {activity.videos && (
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="h-4 w-4 text-red-600" />
                      <span>Video: {activity.videos.title}</span>
                    </div>
                  )}
                  {activity.photos && (
                    <div className="flex items-center gap-2 text-sm">
                      <Camera className="h-4 w-4 text-blue-600" />
                      <span>Photo: {activity.photos.title}</span>
                    </div>
                  )}
                </div>

                {/* Tags and Status */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {activity.tags && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ backgroundColor: activity.tags.color + '20' }}
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {activity.tags.name}
                      </Badge>
                    )}
                    <Badge variant={activity.active ? "default" : "secondary"}>
                      {activity.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Order: {activity.sort_order}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <ActivityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activity={selectedActivity}
      />
    </div>
  );
}; 