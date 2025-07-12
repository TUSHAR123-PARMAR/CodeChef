import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Star, ArrowRight, Check, BookOpen } from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Connect with Learners",
      description: "Find people who want to learn what you can teach, and vice versa."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      title: "Skill Exchange",
      description: "Trade your expertise for new knowledge in a mutually beneficial way."
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: "Build Your Reputation",
      description: "Get rated and reviewed to build trust within the community."
    }
  ];

  const benefits = [
    "Learn new skills from experienced individuals",
    "Teach others and reinforce your own knowledge",
    "Connect with diverse people from all backgrounds",
    "Flexible scheduling that works for everyone",
    "Build meaningful relationships through learning"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <img 
              src="/WhatsApp Image 2025-07-12 at 09.50.10_31f2fd28.jpg" 
              alt="TaalMel Logo" 
              className="h-20 w-auto"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            TaalMel
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-600 mb-8 font-medium">
            Learn. Teach. Repeat.
          </p>
          
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            A revolutionary platform where knowledge flows freely. Connect with students, 
            professionals, homemakers, and seniors to exchange skills and grow together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
            
            <Link
              to="/find-match"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Browse Skills
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How TaalMel Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What is TaalMel?
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                TaalMel is a skill-sharing platform that connects people from all walks of life. 
                Whether you're a student looking to learn professional skills, a professional 
                wanting to pick up a hobby, a homemaker sharing life skills, or a senior passing 
                on wisdom, TaalMel is your community.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Who can benefit from TaalMel?
              </h3>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-100 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">Students</div>
                <p className="text-sm text-blue-700">Learn practical skills from professionals</p>
              </div>
              <div className="bg-green-100 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">Professionals</div>
                <p className="text-sm text-green-700">Share expertise and learn new hobbies</p>
              </div>
              <div className="bg-purple-100 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">Homemakers</div>
                <p className="text-sm text-purple-700">Share life skills and learn new ones</p>
              </div>
              <div className="bg-yellow-100 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-2">Seniors</div>
                <p className="text-sm text-yellow-700">Pass on wisdom and stay engaged</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners and teachers in our growing community.
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <span>Join TaalMel Today</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;