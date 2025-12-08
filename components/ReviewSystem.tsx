
import React, { useState } from 'react';
import { useLanguage, User } from '../types';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  response?: {
    text: string;
    date: string;
  };
}

interface ReviewSystemProps {
  sellerId: string;
  sellerName: string;
  currentUser: User | null;
  onLoginRequired: () => void;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({ sellerId, sellerName, currentUser, onLoginRequired }) => {
  const { language } = useLanguage();
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');

  const mockReviews: Review[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'محمد رضایی',
      rating: 5,
      comment: 'کیفیت محصول عالی بود. تحویل به موقع و قیمت مناسب. حتماً دوباره از این فروشنده خرید می‌کنم.',
      date: '1402/09/15',
      helpful: 12,
      verified: true,
      response: {
        text: 'ممنون از اعتمادتون. خوشحالیم که راضی بودید.',
        date: '1402/09/16'
      }
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'علی احمدی',
      rating: 4,
      comment: 'محصول خوب بود ولی ارسال کمی طول کشید. در کل راضی هستم.',
      date: '1402/09/10',
      helpful: 5,
      verified: true
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'حسین کریمی',
      rating: 5,
      comment: 'قیمت خیلی مناسب بود نسبت به بقیه فروشندگان. پشتیبانی هم خوب بود.',
      date: '1402/09/05',
      helpful: 8,
      verified: false
    },
  ];

  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  const handleSubmitReview = () => {
    if (!currentUser) {
      onLoginRequired();
      return;
    }
    if (newRating === 0 || !newComment.trim()) return;
    setShowWriteReview(false);
    setNewRating(0);
    setNewComment('');
  };

  const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg'; interactive?: boolean }> = ({ rating, size = 'md', interactive = false }) => {
    const sizeClasses = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-8 h-8' };
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && setNewRating(star)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <svg
              className={`${sizeClasses[size]} ${
                star <= (interactive ? (hoverRating || newRating) : rating)
                  ? 'text-yellow-400'
                  : 'text-slate-300'
              } transition-colors`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {language === 'fa' ? 'نظرات خریداران' : 'Customer Reviews'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">{sellerName}</p>
          </div>
          <button
            onClick={() => currentUser ? setShowWriteReview(true) : onLoginRequired()}
            className="px-4 py-2 bg-corp-red text-white rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            {language === 'fa' ? 'ثبت نظر' : 'Write Review'}
          </button>
        </div>

        <div className="mt-6 flex items-center gap-8 flex-wrap">
          <div className="text-center">
            <p className="text-5xl font-bold text-slate-900">{averageRating.toFixed(1)}</p>
            <StarRating rating={Math.round(averageRating)} />
            <p className="text-sm text-slate-500 mt-1">{mockReviews.length} {language === 'fa' ? 'نظر' : 'reviews'}</p>
          </div>
          
          <div className="flex-1 space-y-2 min-w-[200px]">
            {[5, 4, 3, 2, 1].map(star => {
              const count = mockReviews.filter(r => r.rating === star).length;
              const percent = (count / mockReviews.length) * 100;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 w-3">{star}</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }}></div>
                  </div>
                  <span className="text-sm text-slate-500 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showWriteReview && (
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">
            {language === 'fa' ? 'نظر شما درباره این فروشنده' : 'Your Review'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {language === 'fa' ? 'امتیاز شما' : 'Your Rating'}
              </label>
              <StarRating rating={newRating} size="lg" interactive />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {language === 'fa' ? 'نظر شما' : 'Your Comment'}
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="w-full bg-white border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-corp-red resize-none"
                placeholder={language === 'fa' ? 'تجربه خود را با دیگران به اشتراک بگذارید...' : 'Share your experience with others...'}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmitReview}
                disabled={newRating === 0 || !newComment.trim()}
                className="px-6 py-2 bg-corp-red text-white rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'fa' ? 'ثبت نظر' : 'Submit Review'}
              </button>
              <button
                onClick={() => { setShowWriteReview(false); setNewRating(0); setNewComment(''); }}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
              >
                {language === 'fa' ? 'انصراف' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            {mockReviews.length} {language === 'fa' ? 'نظر' : 'reviews'}
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-corp-red"
          >
            <option value="recent">{language === 'fa' ? 'جدیدترین' : 'Most Recent'}</option>
            <option value="helpful">{language === 'fa' ? 'مفیدترین' : 'Most Helpful'}</option>
            <option value="rating">{language === 'fa' ? 'بالاترین امتیاز' : 'Highest Rated'}</option>
          </select>
        </div>

        <div className="space-y-6">
          {mockReviews.map(review => (
            <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {review.userName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-800">{review.userName}</span>
                    {review.verified && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        {language === 'fa' ? 'خرید تأیید شده' : 'Verified Purchase'}
                      </span>
                    )}
                    <span className="text-sm text-slate-400">{review.date}</span>
                  </div>
                  <div className="mt-1">
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="mt-2 text-slate-700">{review.comment}</p>

                  {review.response && (
                    <div className="mt-3 bg-slate-50 rounded-lg p-4 border-r-4 border-corp-red">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-slate-800 text-sm">{language === 'fa' ? 'پاسخ فروشنده' : 'Seller Response'}</span>
                        <span className="text-xs text-slate-400">{review.response.date}</span>
                      </div>
                      <p className="text-sm text-slate-600">{review.response.text}</p>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                      {language === 'fa' ? 'مفید بود' : 'Helpful'} ({review.helpful})
                    </button>
                    <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
                      {language === 'fa' ? 'گزارش' : 'Report'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSystem;
