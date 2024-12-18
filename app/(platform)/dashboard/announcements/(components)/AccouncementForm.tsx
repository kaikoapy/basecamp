// app/(platform)/dashboard/announcements/(components)/AccouncementForm.tsx
"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const AnnouncementForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAnnouncement = useMutation(api.announcements.create);
  const getUploadUrls = useMutation(api.files.generateUploadUrls);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const imageUrls: string[] = [];

      if (images.length > 0) {
        // Get upload URLs for each image
        const uploadUrls = await getUploadUrls({ count: images.length });

        // Upload each image
        await Promise.all(
          images.map(async (image, index) => {
            await fetch(uploadUrls[index], {
              method: "POST",
              body: image,
              headers: {
                "Content-Type": image.type,
              },
            });
            imageUrls.push(uploadUrls[index].split("?")[0]);
          })
        );
      }

      // Create the announcement
      await createAnnouncement({
        title,
        description,
        images: imageUrls,
        category: "announcement",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setImages([]);
      setImagePreview([]);

      toast({
        title: "Success",
        description: "Announcement created successfully",
      });
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement Title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter announcement details..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Images (Optional)</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="w-full"
                disabled={isSubmitting}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                multiple
              />
            </div>
            {imagePreview.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative aspect-video">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="rounded-md object-cover w-full h-full"
                      width={300}
                      height={300}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Post Announcement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AnnouncementForm;
