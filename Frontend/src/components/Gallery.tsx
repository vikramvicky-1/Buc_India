import React, { useEffect, useMemo, useState } from 'react';
import { Camera, Play, Upload, Heart, MessageCircle, Share2 } from 'lucide-react';
import MediaUpload from './MediaUpload';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [playingVideos, setPlayingVideos] = useState<Set<number>>(new Set());

  const categories = [
    { id: 'all', name: 'All Media' },
    { id: 'rides', name: 'Group Rides' },
    { id: 'events', name: 'Events' },
    { id: 'bikes', name: 'Member Bikes' },
    { id: 'rallies', name: 'Rallies' }
  ];

  // Auto-import any images placed under src/assets/gallery
  const autoGalleryItems = useMemo(() => {
    // Vite will replace this with an object of matched modules at build time
    const modules = import.meta.glob('../assets/gallery/**/*.{png,jpg,jpeg,webp,mp4,webm,mov}', { eager: true }) as Record<string, { default: string }>;
    const items = Object.entries(modules).map(([path, mod], index) => {
      const parts = path.split('/');
      const filename = parts[parts.length - 1];
      const title = filename.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '');
      const isVideo = /\.(mp4|webm|mov)$/i.test(filename);
      const normalizedPath = path.toLowerCase();
      const lowerFile = filename.toLowerCase();
      let category: 'rallies' | 'rides' | 'events' | 'bikes' = 'rides';
      if (normalizedPath.includes('/rallies/')) category = 'rallies';
      else if (normalizedPath.includes('/rides/') || normalizedPath.includes('/group-rides/')) category = 'rides';
      else if (lowerFile.includes('rally')) category = 'rallies';
      else if (lowerFile.includes('ride')) category = 'rides';
      return {
        id: 1000 + index,
        type: (isVideo ? 'video' : 'image') as const,
        src: mod.default,
        title,
        category,
        likes: Math.floor(Math.random() * 100) + 10,
        comments: Math.floor(Math.random() * 30),
        author: 'BUC Team'
      };
    });
    return items;
  }, []);

  const baseMediaItems: Array<{ id: number; type: 'image'; src: string; title: string; category: string; likes: number; comments: number; author: string; }> = [];

  const mediaItems = useMemo(() => [...baseMediaItems, ...autoGalleryItems], [autoGalleryItems]);

  const filteredMedia = activeCategory === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === activeCategory);

  // Load More handling
  const INITIAL_COUNT = 6;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const displayedMedia = filteredMedia.slice(0, visibleCount);

  useEffect(() => {
    // Reset visible items when category changes
    setVisibleCount(INITIAL_COUNT);
  }, [activeCategory]);

  return (
    <section id="gallery" className="relative py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1119796/pexels-photo-1119796.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Motorcycle gallery background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/90"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Gallery</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Relive the memories and share your adventures with the community. From epic rides to unforgettable events.
          </p>
        </div>

        {/* Upload Section 
        <div className="bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-2xl p-8 border border-orange-500/20 mb-12">
          <div className="text-center">
            <Upload className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Share Your Adventures</h3>
            <p className="text-gray-300 mb-6">
              Upload photos and videos from your rides to share with fellow club members.
            </p>
            <button 
              onClick={() => setShowMediaUpload(true)}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200"
            >
              Upload Media
            </button>
          </div>
        </div>
*/}
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMedia.map((item) => (
            <div
              key={item.id}
              className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-orange-500/50 transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              <div className="relative">
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    preload="metadata"
                    muted
                    onClick={(e) => {
                      e.stopPropagation();
                      const video = e.currentTarget;
                      if (video.paused) {
                        video.play().then(() => {
                          setPlayingVideos(prev => new Set(prev).add(item.id));
                        });
                      } else {
                        video.pause();
                        setPlayingVideos(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(item.id);
                          return newSet;
                        });
                      }
                    }}
                    onEnded={() => {
                      setPlayingVideos(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(item.id);
                        return newSet;
                      });
                    }}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                
                {/* Video Overlay */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-200">
                      {playingVideos.has(item.id) ? (
                        <div className="h-8 w-8 text-white flex items-center justify-center">
                          <div className="w-2 h-6 bg-white rounded-sm mx-0.5"></div>
                          <div className="w-2 h-6 bg-white rounded-sm mx-0.5"></div>
                        </div>
                      ) : (
                        <Play className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 rounded text-xs">
                      Click to play
                    </div>
                    {item.duration && (
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-sm">
                        {item.duration}
                      </div>
                    )}
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-300 text-sm">by {item.author}</p>
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors duration-200">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{item.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors duration-200">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{item.comments}</span>
                    </button>
                  </div>
                  <button className="text-gray-400 hover:text-orange-500 transition-colors duration-200">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredMedia.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount(filteredMedia.length)}
              className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
            >
              Load More Media
            </button>
          </div>
        )}

        {/* Modal for selected media */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMedia(null)}>
            <div className="max-w-4xl w-full bg-gray-900 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                {selectedMedia.type === 'video' ? (
                  <video
                    src={selectedMedia.src}
                    className="w-full h-96 object-cover"
                    controls
                    autoPlay
                    muted
                  />
                ) : (
                  <img
                    src={selectedMedia.src}
                    alt={selectedMedia.title}
                    className="w-full h-96 object-cover"
                  />
                )}
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedMedia.title}</h3>
                <p className="text-gray-300 mb-4">by {selectedMedia.author}</p>
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                    <Heart className="h-5 w-5" />
                    <span>{selectedMedia.likes} likes</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors duration-200">
                    <MessageCircle className="h-5 w-5" />
                    <span>{selectedMedia.comments} comments</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors duration-200">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <MediaUpload
          isOpen={showMediaUpload}
          onClose={() => setShowMediaUpload(false)}
        />
      </div>
    </section>
  );
};

export default Gallery;