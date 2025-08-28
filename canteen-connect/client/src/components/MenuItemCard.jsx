import React, { useState } from 'react';
import { Star, Heart, MessageCircle } from 'lucide-react';
import axios from 'axios';

const MenuItemCard = ({ item, onRatingUpdate }) => {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`/api/menu/${item._id}/rate`, {
        score: rating,
        comment
      });

      if (response.data.success !== false) {
        // Update the local item with new average rating
        onRatingUpdate(item._id, response.data.newAverageRating);
        setShowRatingForm(false);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (score) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < score ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Item Image */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>No Image</span>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ${item.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        {/* Rating Display */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(Math.round(item.averageRating))}
          </div>
          <span className="text-sm text-gray-600">
            {item.averageRating.toFixed(1)} ({item.averageRating > 0 ? 'Rated' : 'No ratings'})
          </span>
        </div>
      </div>

      {/* Rating Form */}
      {showRatingForm && (
        <form onSubmit={handleRatingSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-field"
              rows="2"
              placeholder="Share your thoughts..."
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-sm px-3 py-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
            <button
              type="button"
              onClick={() => setShowRatingForm(false)}
              className="btn-secondary text-sm px-3 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setShowRatingForm(!showRatingForm)}
          className="flex-1 btn-secondary text-sm py-2"
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          Rate & Review
        </button>
        <button className="btn-primary text-sm py-2">
          <Heart className="w-4 h-4 inline mr-2" />
          Favorite
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
