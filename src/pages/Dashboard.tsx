import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { User as UserType } from '../types';
import { Edit, Users, MessageCircle, Star, BookOpen, Target } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserType);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userProfile || !userProfile.role) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Your Profile
          </h2>
          <p className="text-gray-600 mb-6">
            Please set up your profile to start using TaalMel and connect with other learners.
          </p>
          <Link
            to="/profile-setup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <Edit className="h-5 w-5" />
            <span>Setup Profile</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={userProfile.photoURL || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'}
              alt={userProfile.displayName}
              className="h-20 w-20 rounded-full object-cover"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userProfile.displayName}!
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                {userProfile.role} • Ready to learn and teach
              </p>
              {userProfile.rating && userProfile.rating > 0 && (
                <div className="flex items-center justify-center md:justify-start space-x-2 mt-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {userProfile.rating.toFixed(1)} ({userProfile.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>
            <Link
              to="/profile-setup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/find-match"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Find a Match</h3>
                <p className="text-sm text-gray-600">Discover people to learn from and teach</p>
              </div>
            </div>
          </Link>

          <Link
            to="/swap-requests"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Swap Requests</h3>
                <p className="text-sm text-gray-600">Manage your incoming and outgoing requests</p>
              </div>
            </div>
          </Link>

          <Link
            to="/profile-setup"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
                <Edit className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Update Profile</h3>
                <p className="text-sm text-gray-600">Edit your skills and availability</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Skills Overview */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skills I Can Teach */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Skills I Can Teach</h2>
            </div>
            <div className="space-y-2">
              {userProfile.skillsToTeach.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userProfile.skillsToTeach.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Skills I Want to Learn</h2>
            </div>
            <div className="space-y-2">
              {userProfile.skillsToLearn.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userProfile.skillsToLearn.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Availability</h2>
          <div className="flex flex-wrap gap-2">
            {userProfile.availability.length > 0 ? (
              userProfile.availability.map((time, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                >
                  {time}
                </span>
              ))
            ) : (
              <p className="text-gray-500 italic">No availability set</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;