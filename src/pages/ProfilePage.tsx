import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Edit2, Save, Settings, User } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';

type ProfileFormData = {
  username: string;
  email: string;
  chesscomUsername: string;
  lichessUsername: string;
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      chesscomUsername: '',
      lichessUsername: ''
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would update user data via API
      console.log('Updated profile:', data);
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-red-700 px-6 py-12 text-white flex items-center">
                <div className="bg-white/20 rounded-full p-4 mr-4">
                  <User size={40} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user?.username}</h1>
                  <p>{user?.email}</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center text-sm text-red-700 hover:text-red-800 transition-colors"
                    >
                      {isEditing ? (
                        <>
                          <Settings size={16} className="mr-1" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit2 size={16} className="mr-1" />
                          Edit Profile
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        {isEditing ? (
                          <div>
                            <input
                              id="username"
                              type="text"
                              className={`block w-full border ${
                                errors.username ? 'border-red-300' : 'border-gray-300'
                              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                              {...register('username', { 
                                required: 'Username is required',
                                minLength: {
                                  value: 3,
                                  message: 'Username must be at least 3 characters'
                                }
                              })}
                            />
                            {errors.username && (
                              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-800">{user?.username}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        {isEditing ? (
                          <div>
                            <input
                              id="email"
                              type="email"
                              className={`block w-full border ${
                                errors.email ? 'border-red-300' : 'border-gray-300'
                              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                              {...register('email', { 
                                required: 'Email is required',
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: 'Invalid email address'
                                }
                              })}
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-800">{user?.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <hr />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="chesscomUsername" className="block text-sm font-medium text-gray-700 mb-1">
                            Chess.com Username
                          </label>
                          {isEditing ? (
                            <input
                              id="chesscomUsername"
                              type="text"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                              {...register('chesscomUsername')}
                            />
                          ) : (
                            <p className="text-gray-800">Not connected</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="lichessUsername" className="block text-sm font-medium text-gray-700 mb-1">
                            Lichess Username
                          </label>
                          {isEditing ? (
                            <input
                              id="lichessUsername"
                              type="text"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                              {...register('lichessUsername')}
                            />
                          ) : (
                            <p className="text-gray-800">Not connected</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center justify-center bg-red-700 text-white px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
                    >
                      {isSaving ? (
                        <Spinner size="small" />
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
            
            <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Account Settings</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Password</h3>
                  <button
                    type="button"
                    className="text-red-700 hover:text-red-800 font-medium transition-colors"
                  >
                    Change Password
                  </button>
                </div>
                
                <hr />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Delete Account</h3>
                  <p className="text-gray-600 mb-2">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    type="button"
                    className="text-red-700 border border-red-700 rounded-md px-4 py-2 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;