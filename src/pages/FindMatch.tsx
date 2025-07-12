import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { User as UserType } from '../types';
import UserCard from '../components/UserCard';
import { Search, Filter, Users } from 'lucide-react';

const FindMatch: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [selectedSkillToOffer, setSelectedSkillToOffer] = useState('');
  const [selectedSkillWanted, setSelectedSkillWanted] = useState('');
  const [mySkills, setMySkills] = useState<string[]>([]);

  const roles = ['Student', 'Professional', 'Homemaker', 'Senior'];
  const availabilityOptions = ['Weekdays', 'Weekends', 'Morning', 'Afternoon', 'Evening'];

  useEffect(() => {
    loadUsers();
    loadMySkills();
  }, [user]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, availabilityFilter]);

  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserType[];
      
      // Filter out users without complete profiles
      const completeUsers = usersData.filter(u => 
        u.role && 
        u.skillsToTeach && u.skillsToTeach.length > 0 && 
        u.skillsToLearn && u.skillsToLearn.length > 0
      );
      
      setUsers(completeUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMySkills = async () => {
    if (!user) return;
    
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userData = usersSnapshot.docs.find(doc => doc.id === user.uid)?.data();
      if (userData) {
        setMySkills(userData.skillsToTeach || []);
      }
    } catch (error) {
      console.error('Error loading my skills:', error);
    }
  };

  const filterUsers = () => {
    let filtered = users.filter(u => u.uid !== user?.uid);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.skillsToTeach.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.skillsToLearn.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Role filter
    if (roleFilter) {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    // Availability filter
    if (availabilityFilter) {
      filtered = filtered.filter(u => u.availability.includes(availabilityFilter));
    }

    setFilteredUsers(filtered);
  };

  const handleSendRequest = (targetUser: UserType) => {
    setSelectedUser(targetUser);
    setShowRequestModal(true);
    setRequestMessage('');
    setSelectedSkillToOffer('');
    setSelectedSkillWanted('');
  };

  const submitRequest = async () => {
    if (!user || !selectedUser || !selectedSkillToOffer || !selectedSkillWanted) return;

    try {
      await addDoc(collection(db, 'swapRequests'), {
        fromUser: user.uid,
        toUser: selectedUser.uid,
        fromUserName: user.displayName,
        toUserName: selectedUser.displayName,
        skillOffered: selectedSkillToOffer,
        skillWanted: selectedSkillWanted,
        message: requestMessage,
        status: 'pending',
        createdAt: new Date()
      });

      setShowRequestModal(false);
      alert('Swap request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Learning Match</h1>
          <p className="text-lg text-gray-600">
            Connect with fellow learners and teachers to exchange skills
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            {/* Availability Filter */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Availability</option>
              {availabilityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="h-5 w-5" />
            <span>{filteredUsers.length} learners found</span>
          </div>
        </div>

        {/* User Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(userItem => (
            <UserCard
              key={userItem.uid}
              user={userItem}
              onSendRequest={handleSendRequest}
              currentUserId={user?.uid}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later for new members.
            </p>
          </div>
        )}

        {/* Request Modal */}
        {showRequestModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Send Swap Request to {selectedUser.displayName}
              </h3>

              {/* Skill I'll Offer */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill I'll Teach *
                </label>
                <select
                  value={selectedSkillToOffer}
                  onChange={(e) => setSelectedSkillToOffer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a skill you can teach</option>
                  {mySkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              {/* Skill I Want */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill I Want to Learn *
                </label>
                <select
                  value={selectedSkillWanted}
                  onChange={(e) => setSelectedSkillWanted(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a skill they can teach</option>
                  {selectedUser.skillsToTeach.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Introduce yourself and explain why you'd like to connect..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRequest}
                  disabled={!selectedSkillToOffer || !selectedSkillWanted}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindMatch;