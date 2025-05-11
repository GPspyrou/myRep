// src/app/components/AdminPageComponents/HouseForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { House } from '@/app/types/house';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

interface CustomField {
  fieldName: string;
  fieldValue: string;
}

interface HouseFormProps {
  house: House | null;
  users: User[];
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

export default function HouseForm({ house, users, onSave, onCancel }: HouseFormProps) {
  const [formData, setFormData] = useState<House>(
    house || {
      listingType: '',
      id: '',
      title: '',
      description: '',
      price: '',
      bedrooms: 0,
      bathrooms: 0,
      rooms: 0,
      category: '',
      energyClass: '',
      floor: '',
      hasHeating: 'Yes',
      heatingType: '',
      kitchens: '1',
      latitude: 0,
      longitude: 0,
      location: { latitude: 0, longitude: 0 },
      parking: '',
      size: '',
      isFeatured: false,
      specialFeatures: '',
      suitableFor: '',
      windowType: '',
      yearBuilt: '',
      images: [],
      isPublic: true,
      allowedUsers: [],
    }
  );

  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  useEffect(() => {
    setFormData(
      house || {
        id: '',
        listingType: '',
        title: '',
        description: '',
        price: '',
        bedrooms: 0,
        bathrooms: 0,
        rooms: 0,
        category: '',
        energyClass: '',
        floor: '',
        hasHeating: 'Yes',
        heatingType: '',
        kitchens: '1',
        latitude: 0,
        longitude: 0,
        location: { latitude: 0, longitude: 0 },
        parking: '',
        size: '',
        isFeatured: false,
        specialFeatures: '',
        suitableFor: '',
        windowType: '',
        yearBuilt: '',
        images: [],
        isPublic: true,
        allowedUsers: [],
      }
    );
    setCustomFields([]);
  }, [house]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
      allowedUsers: name === 'isPublic' && checked ? [] : prev.allowedUsers,
    }));
  };

  const handleToggleUser = (uid: string) => {
    setFormData(prev => {
      const currentAllowedUsers = Array.isArray(prev.allowedUsers) ? prev.allowedUsers : [];
      return {
        ...prev,
        allowedUsers: currentAllowedUsers.includes(uid)
          ? currentAllowedUsers.filter(u => u !== uid)
          : [...currentAllowedUsers, uid],
      };
    });
  };

  const handleImageChange = (index: number, field: 'src' | 'alt', value: string) => {
    setFormData(prev => {
      const images = [...prev.images];
      images[index] = { ...images[index], [field]: value };
      return { ...prev, images };
    });
  };

  const addImage = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, { src: '', alt: '' }] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleCustomFieldChange = (
    index: number,
    field: keyof CustomField,
    value: string
  ) => {
    setCustomFields(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addCustomField = () => setCustomFields(prev => [...prev, { fieldName: '', fieldValue: '' }]);
  const removeCustomField = (index: number) => setCustomFields(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const customData = customFields.reduce<Record<string, string>>((acc, { fieldName, fieldValue }) => {
      if (fieldName.trim()) acc[fieldName] = fieldValue;
      return acc;
    }, {});

    const payload = {
      ...formData,
      ...customData,
      location: { latitude: formData.latitude, longitude: formData.longitude },
      allowedUsers: formData.isPublic ? [] : formData.allowedUsers,
    };

    await onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-full sm:max-w-2xl mx-auto space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
      {/* Title */}
      <label className="block space-y-1">
        <span className="font-bold">Title:</span>
        <input type="text" name="title" value={formData.title} onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>

      {/* Description */}
      <label className="block space-y-1">
        <span className="font-bold">Description:</span>
        <textarea name="description" value={formData.description} onChange={handleChange}
          className="border rounded p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>

      {/* Price */}
      <label className="block space-y-1">
        <span className="font-bold">Price:</span>
        <input type="text" name="price" value={formData.price} onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </label>

      {/* Bedrooms, Bathrooms, Rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block space-y-1">
          <span className="font-bold">Bedrooms:</span>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-bold">Bathrooms:</span>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-bold">Rooms:</span>
          <input
            type="number"
            name="rooms"
            value={formData.rooms}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      {/* Category */}
      <label className="block space-y-1">
        <span className="font-bold">Category:</span>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Energy Class */}
      <label className="block space-y-1">
        <span className="font-bold">Energy Class:</span>
        <input
          type="text"
          name="energyClass"
          value={formData.energyClass}
          onChange={handleChange}
          className="border rounded p-2 w-full 🙂 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Floor */}
      <label className="block space-y-1">
        <span className="font-bold">Floor:</span>
        <input
          type="text"
          name="floor"
          value={formData.floor}
          onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Has Heating */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="hasHeating"
          checked={formData.hasHeating === 'Yes'}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              hasHeating: e.target.checked ? 'Yes' : 'No',
            }))
          }
        />
        <span>Has Heating</span>
      </label>

      {/* Heating Type */}
      <label className="block space-y-1">
        <span className="font-bold">Heating Type:</span>
        <input
          type="text"
          name="heatingType"
          value={formData.heatingType}
          onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Kitchens */}
      <label className="block space-y-1">
        <span className="font-bold">Kitchens:</span>
        <input
          type="text"
          name="kitchens"
          value={formData.kitchens}
          onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Latitude and Longitude */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block space-y-1">
          <span className="font-bold">Latitude:</span>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-bold">Longitude:</span>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>

      {/* Parking */}
      <label className="block space-y-1">
        <span className="font-bold">Parking:</span>
        <input
          type="text"
          name="parking"
          value={formData.parking}
          onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Size */}
      <label className="block space-y-1">
        <span className="font-bold">Size:</span>
        <input
          type="text"
          name="size"
          value={formData.size}
          onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Special Features */}
      <label className="block space-y-1">
        <span className="font-bold">Special Features:</span>
        <input
          type="text"
          name="specialFeatures"
          value={formData.specialFeatures}
          onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Suitable For */}
      <label className="block space-y-1">
        <span className="font-bold">Suitable For:</span>
        <input
          type="text"
          name="suitableFor"
          value={formData.suitableFor}
          onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Window Type */}
      <label className="block space-y-1">
        <span className="font-bold">Window Type:</span>
        <input
          type="text"
          name="windowType"
          value={formData.windowType}
          onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Year Built */}
      <label className="block space-y-1">
        <span className="font-bold">Year Built:</span>
        <input
          type="text"
          name="yearBuilt"
          value={formData.yearBuilt}
          onChange={handleChange}
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>

      {/* Featured Listing */}
      <label className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="checkbox"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleCheckboxChange}
        />
        <span>Featured Listing</span>
      </label>

      {/* Is Public */}
      <label className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          type="checkbox"
          name="isPublic"
          checked={formData.isPublic}
          onChange={handleCheckboxChange}
        />
        <span>Is Public</span>
      </label>

      {/* Allowed Users */}
      {!formData.isPublic && Array.isArray(formData.allowedUsers) && (
      <fieldset className="border p-4 rounded">
        <legend className="font-bold">Allowed Users</legend>
        <div className="space-y-2">
          {users.map(u => (
            <label key={u.uid} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.allowedUsers.includes(u.uid)}
                onChange={() => handleToggleUser(u.uid)}
              />
              <span>{u.displayName || u.email}</span>
            </label>
          ))}
        </div>
        </fieldset>
        )}

      {/* Images */}
      <h3 className="text-xl font-bold mt-6">Images</h3>
      {formData.images.map((image, index) => (
        <div key={index} className="flex space-x-4 items-center mt-2">
          <label className="flex-1">
            <span className="sr-only">Image Src</span>
            <input
              type="text"
              placeholder="Image Src"
              value={image.src}
              onChange={e => handleImageChange(index, 'src', e.target.value)}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="flex-1">
            <span className="sr-only">Image Alt</span>
            <input
              type="text"
              placeholder="Image Alt"
              value={image.alt}
              onChange={e => handleImageChange(index, 'alt', e.target.value)}
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addImage}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
      >
        Add Image
      </button>

      <div className="border-t pt-4">
        <h3 className="text-xl font-bold mb-2">Custom Fields</h3>
        {customFields.map((cf, idx) => (
          <div key={idx} className="flex space-x-2 items-center mb-2">
            <input
              type="text"
              placeholder="Field name"
              value={cf.fieldName}
              onChange={e => handleCustomFieldChange(idx, 'fieldName', e.target.value)}
              className="border rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Field value"
              value={cf.fieldValue}
              onChange={e => handleCustomFieldChange(idx, 'fieldValue', e.target.value)}
              className="border rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeCustomField(idx)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >Remove</button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCustomField}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >Add Custom Field</button>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
        <button type="submit" className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
        <button type="button" onClick={onCancel} className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </form>
  );
}
