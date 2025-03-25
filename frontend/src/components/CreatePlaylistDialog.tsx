// CreatePlaylistDialog.tsx - Updated with Spotify-like styling
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useState } from "react";
import { Upload, Image, Loader2 } from "lucide-react";

interface CreatePlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePlaylistDialog = ({ isOpen, onClose }: CreatePlaylistDialogProps) => {
  const { createPlaylist } = usePlaylistStore();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null as File | null,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.imageFile) {
      data.append("image", formData.imageFile);
    }

    await createPlaylist(data);
    setIsLoading(false);
    onClose();
    resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageFile: null,
    });
    setImagePreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Playlist</DialogTitle>
          <DialogDescription className="text-zinc-400">Make your own playlist with your favorite songs</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div 
            className="flex items-center justify-center h-48 bg-zinc-800/50 rounded-lg cursor-pointer group relative overflow-hidden hover:bg-zinc-800 transition-colors"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            
            {imagePreview ? (
              <>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover group-hover:opacity-60 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/60 p-2 rounded-full">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="bg-zinc-700/60 rounded-full p-3 inline-block mb-2">
                  <Upload className="w-6 h-6 text-zinc-300" />
                </div>
                <div>
                  <span className="text-sm font-medium text-white block">Choose an image</span>
                  <span className="text-xs text-zinc-400">Help others recognize your playlist</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <Input
              placeholder="Playlist name"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-zinc-800 border-zinc-700 focus:border-green-500 focus:ring-green-500 py-6 text-lg"
              maxLength={100}
            />
            <div className="text-right text-xs text-zinc-500 mt-1">
              {formData.title.length}/100
            </div>
          </div>

          <div>
            <Textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-zinc-800 border-zinc-700 focus:border-green-500 focus:ring-green-500 resize-none"
              rows={3}
              maxLength={300}
            />
            <div className="text-right text-xs text-zinc-500 mt-1">
              {formData.description.length}/300
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="hover:bg-zinc-800">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !formData.title}
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistDialog;