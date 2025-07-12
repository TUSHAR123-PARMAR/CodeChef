import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import SkillInput from '../components/SkillInput';
import { Camera, Save } from 'lucide-react';

const ProfileSetup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    role: '',
    skillsToTeach: [] as string[],
    skillsToLearn: [] as string[],
    availability: [] as string[],
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const roles = ['Student', 'Professional', 'Homemaker', 'Senior'];
  const availabilityOptions = ['Weekdays', 'Weekends', 'Morning', 'Afternoon', 'Evening'];

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        displayName: user.displayName || ''
      }));
      setPhotoPreview(user.photoURL || '');
      
      // Load existing profile data if available
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfileData({
          displayName: userData.displayName || '',
          role: userData.role || '',
          skillsToTeach: userData.skillsToTeach || [],
          skillsToLearn: userData.skillsToLearn || [],
          availability: userData.availability || [],
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile || !user) return null;
    
    setUploading(true);
    try {
      const photoRef = ref(storage, `profile-photos/${user.uid}`);
      await uploadBytes(photoRef, photoFile);
      const photoURL = await getDownloadURL(photoRef);
      return photoURL;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      let photoURL = user.photoURL;
      
      // Upload photo if a new one was selected
      if (photoFile) {
        const uploadedPhotoURL = await uploadPhoto();
        if (uploadedPhotoURL) {
          photoURL = uploadedPhotoURL;
          await updateProfile(user, { photoURL });
        }
      }

      // Update display name if changed
      if (profileData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: profileData.displayName });
      }

      // Save profile data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: profileData.displayName,
        photoURL,
        role: profileData.role,
        skillsToTeach: profileData.skillsToTeach,
        skillsToLearn: profileData.skillsToLearn,
        availability: profileData.availability,
        createdAt: new Date(),
        rating: 0,
        reviewCount: 0
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
    
    setLoading(false);
  };

  const handleAvailabilityChange = (option: string) => {
    setProfileData(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(item => item !== option)
        : [...prev.availability, option]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Photo */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={photoPreview || '/api/placeholder/128/128'}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600">Click the camera icon to upload a photo</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={profileData.displayName}
                src={photoPreview || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&fit=crop'}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                placeholder="Enter your full name"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                required
                value={profileData.role}
                onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
              >
                <option value="">Select your role</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Skills to Teach */}
            <SkillInput
              label="Skills You Can Teach *"
              skills={profileData.skillsToTeach}
              onChange={(skills) => setProfileData(prev => ({ ...prev, skillsToTeach: skills }))}
              placeholder="e.g., Python Programming, Cooking, Guitar"
            />

            {/* Skills to Learn */}
            <SkillInput
              label="Skills You Want to Learn *"
              skills={profileData.skillsToLearn}
              onChange={(skills) => setProfileData(prev => ({ ...prev, skillsToLearn: skills }))}
              placeholder="e.g., Web Design, Photography, Spanish"
            />

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Availability *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availabilityOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.availability.includes(option)}
                      onChange={() => handleAvailabilityChange(option)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || uploading || !profileData.role || profileData.skillsToTeach.length === 0 || profileData.skillsToLearn.length === 0 || profileData.availability.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>
                {loading || uploading ? 'Saving...' : 'Save Profile'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;