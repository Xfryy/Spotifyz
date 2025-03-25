import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useArtistStore } from "@/stores/useArtistStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateArtistDialog({ open, onOpenChange, onSuccess }: Props) {
  const [image, setImage] = useState<File | null>(null);
  const { createArtist } = useArtistStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      await createArtist(formData);
      form.reset();
      setImage(null);
      onSuccess?.(); // Call success callback instead of onOpenChange
    } catch (error) {
      console.error('Failed to create artist:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Artist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" required />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" />
          </div>
          <div>
            <Label htmlFor="image">Artist Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(file);
              }}
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-2 max-w-xs rounded"
              />
            )}
          </div>
          <Button type="submit" className="w-full">
            Create Artist
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
