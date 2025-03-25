import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useArtistStore } from "@/stores/useArtistStore";
import { Plus, Upload } from "lucide-react";
import toast from "react-hot-toast";

export function CreateArtistDialog() {
  const [artistDialogOpen, setArtistDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const { createArtist } = useArtistStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newArtist, setNewArtist] = useState({
    fullName: "",
    bio: "",
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      if (!image) {
        return toast.error("Please upload an artist image");
      }

      const formData = new FormData();
      formData.append("fullName", newArtist.fullName);
      formData.append("bio", newArtist.bio);
      formData.append("image", image);

      await createArtist(formData);

      // Reset form
      setNewArtist({
        fullName: "",
        bio: "",
      });
      setImage(null);
      setArtistDialogOpen(false);
      toast.success("Artist created successfully");
    } catch (error: any) {
      toast.error("Failed to create artist: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={artistDialogOpen} onOpenChange={setArtistDialogOpen}>
      <DialogTrigger asChild>
        <Button className='bg-cyan-500 hover:bg-cyan-600 text-white'>
          <Plus className='mr-2 h-4 w-4' />
          Add Artist
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-zinc-900 border-zinc-700'>
        <DialogHeader>
          <DialogTitle>Add New Artist</DialogTitle>
          <DialogDescription>Create a new artist profile for your music library</DialogDescription>
        </DialogHeader>
        
        <div className='space-y-4 py-4'>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept='image/*'
            className='hidden'
          />
          <div
            className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
            onClick={() => fileInputRef.current?.click()}
          >
            <div className='text-center'>
              <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                <Upload className='h-6 w-6 text-zinc-400' />
              </div>
              <div className='text-sm text-zinc-400 mb-2'>
                {image ? image.name : "Upload artist image"}
              </div>
              <Button variant='outline' size='sm' className='text-xs'>
                Choose File
              </Button>
            </div>
          </div>

          {image && (
            <div className='flex justify-center'>
              <img
                src={URL.createObjectURL(image)}
                alt="Artist Preview"
                className="mt-2 max-w-xs max-h-48 rounded-lg object-cover"
              />
            </div>
          )}

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Full Name</label>
            <Input
              value={newArtist.fullName}
              onChange={(e) => setNewArtist({ ...newArtist, fullName: e.target.value })}
              className='bg-zinc-800 border-zinc-700'
              placeholder='Enter artist full name'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Bio (Optional)</label>
            <Textarea
              value={newArtist.bio}
              onChange={(e) => setNewArtist({ ...newArtist, bio: e.target.value })}
              className='bg-zinc-800 border-zinc-700'
              placeholder='Enter artist biography'
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant='outline' 
            onClick={() => setArtistDialogOpen(false)} 
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className='bg-cyan-500 hover:bg-cyan-600'
            disabled={isLoading || !image || !newArtist.fullName}
          >
            {isLoading ? "Creating..." : "Add Artist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateArtistDialog;