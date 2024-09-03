'use client'

import { useState, ChangeEvent, FormEvent } from 'react';
import {useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth"
import {auth, createUser} from "@/firebase"
import { useAlertStore } from '@/store/AlertStore';
import { AlertType } from '@/enums';
import { signOut } from 'firebase/auth';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isAdmin: boolean;
}

const initialFormData: FormData = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  isAdmin: false,
};

const Register = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)
  const [setAlert] = useAlertStore(state => [state.setAlert])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let alertBody: AlertBody
    try {
      // createUser(formData)
      // await createUserWithEmailAndPassword(formData.email, formData.password)
      // signOut(auth)
      // setFormData(initialFormData)
      // alertBody = {
      //   title: "Success!",
      //   content: "User was created successfully"
      // }
      // setAlert(alertBody, AlertType.Success)
    } catch (e) {
      alertBody = {
        title: "Something went wrong.",
        content: "User was not created"
      }
      setAlert(alertBody, AlertType.Error)
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setFormData((prevData) => ({ ...prevData, password }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Register User</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mt-1"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        <div className="flex">
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-l mt-1"
            required
          />
          <button
            type="button"
            onClick={generatePassword}
            className="bg-indigo-500 text-white px-4 py-2 rounded-r mt-1 hover:bg-indigo-600 transition duration-200"
          >
            Generate Password
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={handleChange}
            className="form-checkbox text-indigo-600"
          />
          <span className="ml-2 text-gray-700">Admin</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition duration-200"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Register;
