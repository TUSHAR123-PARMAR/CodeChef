import React from 'react';
import { Star, Send } from 'lucide-react';
import { User } from '../types';

interface UserCardProps {
  user: User;
  onSendRequest: (user: User) => void;
  currentUserId?: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, onSendRequest, currentUserId }) => {
  if (user.uid === currentUserId) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Profile header */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={user.photoURL || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'}
          alt={user.displayName}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{user.displayName}</h3>
          <p className="text-sm text-gray-600">{user.role}</p>
          {user.rating && (
            <div className="flex items-center space-x-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {user.rating.toFixed(1)} ({user.reviewCount || 0} reviews)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Skills they can teach */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Can Teach:</h4>
        <div className="flex flex-wrap gap-1">
          {user.skillsToTeach.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
          {user.skillsToTeach.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              +{user.skillsToTeach.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Skills they want to learn */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Wants to Learn:</h4>
        <div className="flex flex-wrap gap-1">
          {user.skillsToLearn.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
          {user.skillsToLearn.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              +{user.skillsToLearn.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Available:</h4>
        <div className="flex flex-wrap gap-1">
          {user.availability.slice(0, 2).map((time, index) => (
            <span
              key={index}
              className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
            >
              {time}
            </span>
          ))}
          {user.availability.length > 2 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              +{user.availability.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Send request button */}
      <button
        onClick={() => onSendRequest(user)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
      >
        <Send className="h-4 w-4" />
        <span>Send Swap Request</span>
      </button>
    </div>
  );
};

export default UserCard;