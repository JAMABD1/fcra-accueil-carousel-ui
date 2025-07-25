import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Activity = Tables<"activities">;

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity?: Activity | null;
}

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  isOpen,
  onClose,
  activity,
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!activity;

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    video_id: "none",
    photo_id: "none",
    video_description: "",
    photo_description: "",
    tag_id: "none",
    sort_order: 0,
    active: true,
  });

  // Remove fetching of sections

  const { data: videos } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("id, title")
        .eq("status", "published")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const { data: photos } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("photos")
        .select("id, title")
        .eq("status", "published")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title,
        subtitle: activity.subtitle || "",
        description: activity.description || "",
        video_id: activity.video_id || "none",
        photo_id: activity.photo_id || "none",
        video_description: activity.video_description || "",
        photo_description: activity.photo_description || "",
        tag_id: activity.tag_id || "none",
        sort_order: activity.sort_order || 0,
        active: activity.active ?? true,
      });
    } else {
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        video_id: "none",
        photo_id: "none",
        video_description: "",
        photo_description: "",
        tag_id: "none",
        sort_order: 0,
        active: true,
      });
    }
  }, [activity]);

  const saveActivity = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        video_id: data.video_id === "none" ? null : data.video_id,
        photo_id: data.photo_id === "none" ? null : data.photo_id,
        tag_id: data.tag_id === "none" ? null : data.tag_id,
        video_description: data.video_description || null,
        photo_description: data.photo_description || null,
        subtitle: data.subtitle || null,
        description: data.description || null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("activities")
          .update(payload)
          .eq("id", activity.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("activities")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success(isEditing ? "Activity updated successfully" : "Activity created successfully");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to save activity");
      console.error("Save error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveActivity.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Activity" : "Add New Activity"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Activity title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange("subtitle", e.target.value)}
                    placeholder="Activity subtitle"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Activity description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose either a section (for grouped content) or individual media items
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="video_id">Video</Label>
                  <Select
                    value={formData.video_id}
                    onValueChange={(value) => handleInputChange("video_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a video" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {videos?.map((video) => (
                        <SelectItem key={video.id} value={video.id}>
                          {video.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="photo_id">Photo</Label>
                  <Select
                    value={formData.photo_id}
                    onValueChange={(value) => handleInputChange("photo_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a photo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {photos?.map((photo) => (
                        <SelectItem key={photo.id} value={photo.id}>
                          {photo.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="video_description">Video Description</Label>
                  <Textarea
                    id="video_description"
                    value={formData.video_description}
                    onChange={(e) => handleInputChange("video_description", e.target.value)}
                    placeholder="Description for the video"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="photo_description">Photo Description</Label>
                  <Textarea
                    id="photo_description"
                    value={formData.photo_description}
                    onChange={(e) => handleInputChange("photo_description", e.target.value)}
                    placeholder="Description for the photo"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tag_id">Tag</Label>
                  <Select
                    value={formData.tag_id}
                    onValueChange={(value) => handleInputChange("tag_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {tags?.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => handleInputChange("sort_order", parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleInputChange("active", checked)}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveActivity.isPending}>
              {saveActivity.isPending ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 