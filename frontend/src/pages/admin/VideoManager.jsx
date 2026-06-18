import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { FaPlus, FaTrash, FaSpinner, FaTimes, FaVideo, FaYoutube, FaPlay } from 'react-icons/fa';

// Helper to extract video ID and detect platform from various link formats
const extractVideoDetails = (url) => {
  if (!url) return { id: '', platform: 'youtube' };
  
  const trimmed = url.trim();
  
  // Facebook check
  if (trimmed.includes('facebook.com') || trimmed.includes('fb.watch')) {
    const fbMatch = trimmed.match(/(?:\/videos(?:\/[^\/]+)?\/|\/watch\/\?v=|\/showcase\/|fb\.watch\/)([0-9]+)/) || trimmed.match(/\/videos\/([0-9]+)/) || trimmed.match(/[0-9]+/);
    const id = fbMatch ? fbMatch[1] : trimmed;
    return { id, platform: 'facebook' };
  }
  
  // YouTube check
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : trimmed;
  return { id, platform: 'youtube' };
};

export default function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [urlInput, setUrlInput] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('0:30');
  const [type, setType] = useState('short'); // 'demo' or 'short'

  const { showToast } = useToast();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/videos');
      if (res.data.success) {
        setVideos(res.data.videos);
      }
    } catch (error) {
      showToast('Failed to load videos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenModal = () => {
    setUrlInput('');
    setTitle('');
    setDescription('');
    setDuration('0:30');
    setType('short');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id: videoId, platform } = extractVideoDetails(urlInput);
    if (!videoId) {
      showToast('Please enter a valid YouTube or Facebook Video URL.', 'error');
      return;
    }

    if (platform === 'youtube' && videoId.length !== 11) {
      showToast('Please enter a valid YouTube Video URL or 11-character Video ID.', 'error');
      return;
    }

    if (!title.trim()) {
      showToast('Please enter a title for the video.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const res = await api.post('/videos', {
        id: videoId,
        title: title.trim(),
        description: description.trim(),
        duration: duration.trim(),
        type,
        platform
      });

      if (res.data.success) {
        showToast('Video added to showcase successfully.', 'success');
        fetchVideos();
        handleCloseModal();
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to add video.';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      const res = await api.delete(`/videos/${id}`);
      if (res.data.success) {
        showToast('Video removed successfully.', 'success');
        fetchVideos();
      }
    } catch (error) {
      showToast('Failed to remove video.', 'error');
    }
  };

  const demos = videos.filter(v => v.type === 'demo');
  const shorts = videos.filter(v => v.type === 'short');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-heading font-black text-slate-800 text-sm md:text-base uppercase tracking-wider">Video Showcase Manager</h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">Manage long product demonstrations and short social reels/shorts.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="px-5 py-2.5 bg-brand-red hover:bg-red-750 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition-colors cursor-pointer"
        >
          <FaPlus /> Add Video
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-3xl text-brand-red" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Featured Demos */}
          <div className="space-y-4">
            <h4 className="font-heading font-black text-brand-navy text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>Featured Demos (Full Length)</span>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{demos.length} Videos</span>
            </h4>
            {demos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demos.map((video) => (
                  <div key={video._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group relative">
                    <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                      <img 
                        src={video.platform === 'facebook' ? '/slide3.jpg' : `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} 
                        alt={video.title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                        <div className="w-10 h-10 bg-brand-red text-white rounded-full flex items-center justify-center shadow-lg">
                          <FaPlay className="text-xs ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[9px] font-bold text-white tracking-wider">
                        {video.duration}
                      </span>
                    </div>
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h5 className="font-heading font-black text-slate-800 text-xs truncate">{video.title}</h5>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{video.id}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        className="p-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-650 rounded-xl flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 py-10 text-center rounded-2xl border border-slate-200/50">
                <p className="text-xs font-semibold text-slate-400">No featured demo videos added yet.</p>
              </div>
            )}
          </div>

          {/* Section 2: Featured Shorts & Reels */}
          <div className="space-y-4">
            <h4 className="font-heading font-black text-brand-navy text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>Featured Shorts & Reels</span>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{shorts.length} Reels</span>
            </h4>
            {shorts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {shorts.map((video) => (
                  <div key={video._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group relative">
                    <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                      <img 
                        src={video.platform === 'facebook' ? '/slide3.jpg' : `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} 
                        alt={video.title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                        <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center shadow-lg">
                          <FaPlay className="text-[9px] ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-slate-900/80 px-2 py-0.5 rounded text-[9px] font-bold text-white tracking-wider">
                        {video.duration}
                      </span>
                    </div>
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h5 className="font-heading font-bold text-xs text-slate-800 line-clamp-2 leading-tight">{video.title}</h5>
                        <p className="text-[9px] text-slate-400 mt-0.5 truncate">{video.id}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        className="p-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-650 rounded-xl flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 py-10 text-center rounded-2xl border border-slate-200/50">
                <p className="text-xs font-semibold text-slate-400">No shorts or reels added yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={handleCloseModal} className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" />

          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-scale-up">
            {/* Header */}
            <div className="bg-brand-navy p-5 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="font-heading font-black text-base uppercase tracking-wider flex items-center gap-2">
                <FaVideo className="text-brand-red text-sm" /> Add Video / Reel
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-brand-red text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* YouTube URL */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  YouTube Video or Shorts Link
                </label>
                <input
                  type="text"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g. https://www.youtube.com/shorts/R5D1xX3T5J0"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Showcase Category
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    type === 'demo'
                      ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-650'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="demo"
                      checked={type === 'demo'}
                      onChange={() => setType('demo')}
                      className="hidden"
                    />
                    <span className="text-xs">Featured Demo</span>
                  </label>
                  <label className={`border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    type === 'short'
                      ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-650'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="short"
                      checked={type === 'short'}
                      onChange={() => setType('short')}
                      className="hidden"
                    />
                    <span className="text-xs">Short / Reel</span>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Video Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Multi-Grain Grinding Demonstration"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Duration & Description Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 0:58"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Brief Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional details..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-605 font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-brand-red hover:bg-red-750 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer disabled:opacity-75"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : null}
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
