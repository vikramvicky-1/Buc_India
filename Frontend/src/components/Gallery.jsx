import React, { useEffect, useMemo, useState } from "react";
import { galleryService } from "../services/api";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "all", name: "All Media" },
    { id: "rides", name: "Group Rides" },
    { id: "events", name: "Events" },
    { id: "bikes", name: "Member Bikes" },
    { id: "rallies", name: "Rallies" },
  ];

  const autoGalleryItems = useMemo(() => {
    const modules = import.meta.glob(
      "../assets/gallery/**/*.{png,jpg,jpeg,webp,mp4,webm,mov}",
      { eager: true },
    );
    const items = Object.entries(modules).map(([path, mod], index) => {
      const parts = path.split("/");
      const filename = parts[parts.length - 1];
      const title = filename.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "");
      const isVideo = /\.(mp4|webm|mov)$/i.test(filename);
      const normalizedPath = path.toLowerCase();
      let category = "rides";
      if (normalizedPath.includes("/rallies/")) category = "rallies";
      else if (normalizedPath.includes("/rides/")) category = "rides";
      
      return {
        id: 1000 + index,
        type: isVideo ? "video" : "image",
        src: mod.default,
        title,
        category,
        likes: Math.floor(Math.random() * 100) + 10,
        author: "BUC Team",
      };
    });
    return items;
  }, []);

  const mediaItems = useMemo(() => {
    const backendItems = galleryItems.map(item => ({
      id: item._id,
      type: "image",
      src: item.imageUrl,
      title: item.eventName,
      category: item.category || "events",
      author: "Admin",
      likes: 0
    }));
    return [...backendItems, ...autoGalleryItems];
  }, [galleryItems, autoGalleryItems]);

  const filteredMedia = activeCategory === "all" 
    ? mediaItems 
    : mediaItems.filter(item => item.category === activeCategory);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const data = await galleryService.getAll();
        setGalleryItems(data);
      } catch (err) {
        console.warn("Using local assets only.");
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="section-container py-24 bg-carbon text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 reveal-text visible">
          <div>
            <span className="text-copper font-body tracking-ultra text-xs md:text-sm uppercase mb-2 block font-bold">Visual Legacy</span>
            <h2 className="font-heading text-6xl md:text-8xl uppercase leading-none">The <span className="text-transparent outline-title">Archive</span></h2>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 border font-body text-[10px] uppercase tracking-widest transition-all duration-500 ${
                  activeCategory === cat.id 
                  ? "bg-copper border-copper text-carbon font-bold" 
                  : "border-white/10 text-steel-dim hover:border-white/30"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((item, i) => (
            <div 
              key={item.id} 
              className="group relative overflow-hidden bg-carbon-light border border-white/5 aspect-square cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              {item.type === "video" ? (
                <video src={item.src} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" muted loop />
              ) : (
                <img src={item.src} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" />
              )}
              
              <div className="absolute inset-0 bg-carbon/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-copper font-body text-[10px] uppercase tracking-widest mb-1">{item.category}</span>
                <h3 className="font-heading text-xl uppercase mb-2">{item.title}</h3>
                <div className="w-0 group-hover:w-full h-[1px] bg-copper transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog - Simplified implementation using Tailwind */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-carbon/95 backdrop-blur-xl">
          <button 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-10 right-10 text-white font-heading text-4xl hover:text-copper transition-colors"
          >
            ✕
          </button>
          
          <div className="max-w-5xl w-full">
            {selectedMedia.type === "video" ? (
              <video src={selectedMedia.src} className="w-full border border-white/10" controls autoPlay />
            ) : (
              <img src={selectedMedia.src} alt={selectedMedia.title} className="w-full border border-white/10" />
            )}
            <div className="mt-8 text-center">
              <span className="text-copper font-body text-xs uppercase tracking-widest mb-2 block">{selectedMedia.category}</span>
              <h3 className="font-heading text-4xl uppercase text-white">{selectedMedia.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
