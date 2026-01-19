import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Reply, Clock, User, Pin, Lock } from 'lucide-react';

const Forum = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', count: 156 },
    { id: 'general', name: 'General Discussion', count: 45 },
    { id: 'rides', name: 'Ride Planning', count: 32 },
    { id: 'maintenance', name: 'Bike Maintenance', count: 28 },
    { id: 'gear', name: 'Gear Reviews', count: 21 },
    { id: 'events', name: 'Events', count: 18 },
    { id: 'newbie', name: 'New Rider Help', count: 12 }
  ];

  const forumPosts = [
    {
      id: 1,
      title: 'Planning a Cross-Country Adventure - Route Suggestions?',
      author: 'Rajesh Kumar',
      category: 'rides',
      replies: 23,
      likes: 15,
      lastActivity: '2 hours ago',
      isPinned: true,
      preview: 'Hey everyone! Planning a 3-week cross-country ride from Delhi to Mumbai. Looking for must-see stops and rider-friendly routes...'
    },
    {
      id: 2,
      title: 'Best Winter Riding Gear - What Do You Recommend?',
      author: 'Pradeep ',
      category: 'gear',
      replies: 18,
      likes: 12,
      lastActivity: '4 hours ago',
      preview: 'Winter is coming and I need to upgrade my cold weather gear. What are your go-to brands for heated gloves and jackets?'
    }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? forumPosts 
    : forumPosts.filter(post => post.category === activeCategory);

  return (
    <section id="forum" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Motorcycle forum background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/85"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Forum</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with fellow riders, share experiences, ask questions, and be part of our vibrant community discussions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700 sticky top-8">
              <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200">
                New Topic
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-orange-500/50 transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-700 border-2 border-orange-500 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {post.isPinned && (
                          <Pin className="h-4 w-4 text-orange-500" />
                        )}
                        <h3 className="text-lg font-semibold text-white group-hover:text-orange-500 transition-colors duration-200 cursor-pointer">
                          {post.title}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.lastActivity}</span>
                        </div>
                        <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">
                          {categories.find(c => c.id === post.category)?.name}
                        </span>
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-2">
                        {post.preview}
                      </p>

                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors duration-200 cursor-pointer">
                          <Reply className="h-4 w-4" />
                          <span className="text-sm">{post.replies} replies</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm">{post.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-2xl p-8 border border-orange-500/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">247</div>
              <div className="text-gray-300">Total Topics</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">280</div>
              <div className="text-gray-300">Total Posts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">10</div>
              <div className="text-gray-300">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-300">Community Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Forum;
