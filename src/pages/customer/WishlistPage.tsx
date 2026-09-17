import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ArrowRight,
  Mountain,
  Calendar,
  Clock,
  Trash2,
  Share2,
  Sparkles,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { Button } from '@/components/ui/button';
import { ALL_OTA_LISTINGS } from '@/data/otaMarketplaceData';

export const WishlistPage: React.FC = () => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    ALL_OTA_LISTINGS[0].id,
    ALL_OTA_LISTINGS[1].id,
    ALL_OTA_LISTINGS[3].id,
  ]);

  const [copiedLink, setCopiedLink] = useState(false);

  const savedListings = ALL_OTA_LISTINGS.filter((item) => wishlistIds.includes(item.id));

  const handleRemove = (id: string) => {
    setWishlistIds(wishlistIds.filter((item) => item !== id));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-[#FBF8F3] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E4DD]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E4DD] text-xs font-bold text-[#C8362E] mb-2">
                <Heart className="w-3.5 h-3.5 fill-[#C8362E]" />
                <span>Saved Expeditions & Treks</span>
              </div>
              <h1 className="font-serif text-3xl font-black text-[#1A1F1D]">
                My Himalayan Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6B66] mt-1">
                Curated adventures you are planning to experience with verified local operators.
              </p>
            </div>

            {savedListings.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="text-xs font-bold flex items-center gap-1.5 bg-white border-[#E8E4DD]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Wishlist'}</span>
              </Button>
            )}
          </div>

          {/* Empty State */}
          {savedListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E4DD] p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#C8362E] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1A1F1D]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#5F6B66]">
                Explore our handpicked collection of 45+ verified Himalayan treks and river expeditions.
              </p>
              <Link to="/activities">
                <Button variant="primary" size="md" className="text-xs font-bold bg-[#1E4B8F] text-white mt-2">
                  Browse All Adventures
                </Button>
              </Link>
            </div>
          ) : (
            /* Saved Listings Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedListings.map((item) => {
                const deposit15 = Math.round(item.price * 0.15);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#E8E4DD] shadow-sm overflow-hidden flex flex-col hover:border-[#1E4B8F] transition-all group"
                  >
                    {/* Image Header */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#1A1F1D]/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                        {item.category}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#C8362E] hover:bg-white flex items-center justify-center shadow-md transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#1A1F1D] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#1E4B8F]" />
                        <span>{item.duration}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#5F6B66]">
                          <span className="font-semibold text-[#1E4B8F]">{item.location}</span>
                          <span className="bg-[#FBF8F3] px-2 py-0.5 rounded border border-[#E8E4DD] font-semibold">
                            {item.difficulty}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-base text-[#1A1F1D] group-hover:text-[#1E4B8F] transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        <p className="text-xs text-[#5F6B66] line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E8E4DD] flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-[#5F6B66]">Total Price:</div>
                          <div className="font-serif text-lg font-black text-[#1A1F1D]">
                            ${item.price} <span className="text-[10px] font-normal text-[#5F6B66]">USD</span>
                          </div>
                          <div className="text-[10px] text-[#16A34A] font-bold">
                            Only ${deposit15} deposit to reserve
                          </div>
                        </div>

                        <Link to={`/activities/${item.id}`}>
                          <Button
                            variant="primary"
                            size="sm"
                            className="bg-[#1E4B8F] hover:bg-[#15386C] text-white text-xs font-bold flex items-center gap-1"
                          >
                            <span>Book Now</span>
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};
