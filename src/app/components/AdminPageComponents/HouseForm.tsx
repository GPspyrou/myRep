'use client';

import { useState, useEffect } from 'react';
import { House } from '@/app/types/house';
import DetailsContent from '@/app/components/DetailsPageComponents/DetailsContent';

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
  PropertyHeaders?: string[];
  propertyDetails?: string[];
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
  const [PropertyHeaders, setPropertyHeaders] = useState<string[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const previewData = {
    ...formData,
    // merge in any customFields:
    ...customFields.reduce((acc, {fieldName, fieldValue}) => {
      if (fieldName.trim()) acc[fieldName] = fieldValue;
      return acc;
    }, {} as Record<string,string>),
    location: { latitude: formData.latitude, longitude: formData.longitude },
    allowedUsers: formData.isPublic ? [] : formData.allowedUsers,
    PropertyHeaders,
    propertyDetails,
  };
  useEffect(() => {
    if (house) {
      setFormData(house);
  
      const knownKeys = [
        'listingType', 'id', 'title', 'description', 'price', 'bedrooms', 'bathrooms',
        'rooms', 'category', 'energyClass', 'floor', 'hasHeating', 'heatingType',
        'kitchens', 'latitude', 'longitude', 'location', 'parking', 'size',
        'isFeatured', 'specialFeatures', 'suitableFor', 'windowType', 'yearBuilt',
        'images', 'isPublic', 'allowedUsers', 'PropertyHeaders', 'propertyDetails'
      ];
  
      // Identify custom fields from house object
      const customFieldsFromHouse: CustomField[] = Object.entries(house)
        .filter(([key]) => !knownKeys.includes(key))
        .map(([key, value]) => ({
          fieldName: key,
          fieldValue: String(value)
        }));
  
      setCustomFields(customFieldsFromHouse);
  
      const incomingHeaders = Array.isArray(house.PropertyHeaders) ? house.PropertyHeaders : [];
      setPropertyHeaders(Array.from(new Set([...DEFAULT_HEADER_FIELDS, ...incomingHeaders])));
  
      setPropertyDetails(Array.isArray(house.propertyDetails) ? house.propertyDetails : []);
    } else  {
      setFormData({
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
      });
      setCustomFields([]);
    setPropertyHeaders([...DEFAULT_HEADER_FIELDS]);
    setPropertyDetails([]);
  }
}, [house]);

  const DEFAULT_HEADER_FIELDS = ['title', 'price'];

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

  const removeCustomField = (index: number) => {
    const fieldName = customFields[index].fieldName;
    setCustomFields(prev => prev.filter((_, i) => i !== index));
    setPropertyHeaders(prev => prev.filter(f => f !== fieldName));
    setPropertyDetails(prev => prev.filter(f => f !== fieldName));
  };

  const excludedFields = ['id', 'images', 'allowedUsers', 'location', 'PropertyHeaders', 'propertyDetails'];
  const allFields = [...new Set([
    ...Object.keys(formData).filter(key => !excludedFields.includes(key)),
    ...customFields.map(cf => cf.fieldName).filter(name => name.trim() !== '')
  ])].sort();

  const handleHeaderCheckbox = (field: string, checked: boolean) => {
    setPropertyHeaders(prev =>
      checked ? [...prev, field] : prev.filter(f => f !== field)
    );
  };

  const handleDetailsCheckbox = (field: string, checked: boolean) => {
    setPropertyDetails(prev =>
      checked ? [...prev, field] : prev.filter(f => f !== field)
    );
  };

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
      PropertyHeaders,
      propertyDetails,
    };

    await onSave(payload);
  };
  
  return (
    <>
    <form onSubmit={handleSubmit} className="max-w-full sm:max-w-2xl mx-auto space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
      
      {/* Title */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Title:</span>
          <input type="text" name="title" required value={formData.title} onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('title')}
            onChange={(e) => handleDetailsCheckbox('title', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>
      {/* Listing Type */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Listing Type:</span>
          <select
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select type</option>
            <option value="sale">Sale</option>
            <option value="rental">Rental</option>
          </select>
        </label>
      </div>
      {/* Description */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Description:</span>
          <textarea name="description" value={formData.description} onChange={handleChange}
            className="border rounded p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
      </div>

      {/* Price */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Price:</span>
          <input type="text" name="price" value={formData.price}  onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('price')}
            onChange={(e) => handleDetailsCheckbox('price', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

      {/* Bedrooms */}
<div className="flex items-center space-x-4">
  <label className="flex-1 space-y-1">
    <span className="font-bold">Bedrooms:</span>
    <input
      type="number"
      name="bedrooms"
      value={formData.bedrooms}
      onChange={handleChange}
      className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </label>
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={PropertyHeaders.includes('bedrooms')}
      onChange={e => handleHeaderCheckbox('bedrooms', e.target.checked)}
    />
    <span>Header</span>
  </label>
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={propertyDetails.includes('bedrooms')}
      onChange={e => handleDetailsCheckbox('bedrooms', e.target.checked)}
    />
    <span>Details</span>
  </label>
</div>

{/* Bathrooms */}
<div className="flex items-center space-x-4">
  <label className="flex-1 space-y-1">
    <span className="font-bold">Bathrooms:</span>
    <input
      type="number"
      name="bathrooms"
      value={formData.bathrooms}
      onChange={handleChange}
      className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </label>
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={PropertyHeaders.includes('bathrooms')}
      onChange={e => handleHeaderCheckbox('bathrooms', e.target.checked)}
    />
    <span>Header</span>
  </label>
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={propertyDetails.includes('bathrooms')}
      onChange={e => handleDetailsCheckbox('bathrooms', e.target.checked)}
    />
    <span>Details</span>
  </label>
</div>

{/* Rooms */}
<div className="flex items-center space-x-4">
  <label className="flex-1 space-y-1">
    <span className="font-bold">Rooms:</span>
    <input
      type="number"
      name="rooms"
      value={formData.rooms}
      onChange={handleChange}
      className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </label>
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={PropertyHeaders.includes('rooms')}
      onChange={e => handleHeaderCheckbox('rooms', e.target.checked)}
    />
    <span>Header</span>
  </label>
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={propertyDetails.includes('rooms')}
      onChange={e => handleDetailsCheckbox('rooms', e.target.checked)}
    />
    <span>Details</span>
  </label>
</div>

      {/* Category */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Category:</span>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={PropertyHeaders.includes('category')}
            onChange={(e) => handleHeaderCheckbox('category', e.target.checked)}
          />
          <span>Header</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('category')}
            onChange={(e) => handleDetailsCheckbox('category', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

      {/* Energy Class */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Energy Class:</span>
          <input
            type="text"
            name="energyClass"
            value={formData.energyClass}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={PropertyHeaders.includes('energyClass')}
            onChange={(e) => handleHeaderCheckbox('energyClass', e.target.checked)}
          />
          <span>Header</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('energyClass')}
            onChange={(e) => handleDetailsCheckbox('energyClass', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

      {/* Floor */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Floor:</span>
          <input
            type="text"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={PropertyHeaders.includes('floor')}
            onChange={(e) => handleHeaderCheckbox('floor', e.target.checked)}
          />
          <span>Header</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('floor')}
            onChange={(e) => handleDetailsCheckbox('floor', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

      {/* Has Heating */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 flex-1">
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
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={PropertyHeaders.includes('hasHeating')}
            onChange={(e) => handleHeaderCheckbox('hasHeating', e.target.checked)}
          />
          <span>Header</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('hasHeating')}
            onChange={(e) => handleDetailsCheckbox('hasHeating', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

      {/* Heating Type */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Heating Type:</span>
          <input
            type="text"
            name="heatingType"
            value={formData.heatingType}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={PropertyHeaders.includes('heatingType')}
            onChange={(e) => handleHeaderCheckbox('heatingType', e.target.checked)}
          />
          <span>Header</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('heatingType')}
            onChange={(e) => handleDetailsCheckbox('heatingType', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

      {/* Kitchens */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Kitchens:</span>
          <input
            type="text"
            name="kitchens"
            value={formData.kitchens}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={PropertyHeaders.includes('kitchens')}
            onChange={(e) => handleHeaderCheckbox('kitchens', e.target.checked)}
          />
          <span>Header</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('kitchens')}
            onChange={(e) => handleDetailsCheckbox('kitchens', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

      {/* Latitude and Longitude */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-4">
          <label className="flex-1 space-y-1">
            <span className="font-bold">Latitude:</span>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex-1 space-y-1">
            <span className="font-bold">Longitude:</span>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Parking */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Parking:</span>
          <input
            type="text"
            name="parking"
            value={formData.parking}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={PropertyHeaders.includes('parking')}
            onChange={(e) => handleHeaderCheckbox('parking', e.target.checked)}
          />
          <span>Header</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('parking')}
            onChange={(e) => handleDetailsCheckbox('parking', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

      {/* Size */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Size:</span>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={PropertyHeaders.includes('size')}
            onChange={(e) => handleHeaderCheckbox('size', e.target.checked)}
          />
          <span>Header</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('size')}
            onChange={(e) => handleDetailsCheckbox('size', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

        {/* Suitable For */}
        <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Suitable For:</span>
          <input
            type="text"
            name="suitableFor"
            value={formData.suitableFor}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={PropertyHeaders.includes('suitableFor')}
            onChange={e => handleHeaderCheckbox('suitableFor', e.target.checked)}
          />
          <span>Header</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('suitableFor')}
            onChange={e => handleDetailsCheckbox('suitableFor', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

      {/* Window Type */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Window Type:</span>
          <input
            type="text"
            name="windowType"
            value={formData.windowType}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={PropertyHeaders.includes('windowType')}
            onChange={e => handleHeaderCheckbox('windowType', e.target.checked)}
          />
          <span>Header</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('windowType')}
            onChange={e => handleDetailsCheckbox('windowType', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

      {/* Year Built */}
      <div className="flex items-center space-x-4">
        <label className="flex-1 space-y-1">
          <span className="font-bold">Year Built:</span>
          <input
            type="text"
            name="yearBuilt"
            value={formData.yearBuilt}
            onChange={handleChange}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={PropertyHeaders.includes('yearBuilt')}
            onChange={e => handleHeaderCheckbox('yearBuilt', e.target.checked)}
          />
          <span>Header</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={propertyDetails.includes('yearBuilt')}
            onChange={e => handleDetailsCheckbox('yearBuilt', e.target.checked)}
          />
          <span>Details</span>
        </label>
      </div>

      {/* Featured & Public */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleCheckboxChange}
          />
          <span>Featured Listing</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleCheckboxChange}
          />
          <span>Is Public</span>
        </label>
      </div>

      {/* Allowed Users */}
      {!formData.isPublic && (
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
      {formData.images.map((img, idx) => (
        <div key={idx} className="flex space-x-4 items-center mt-2">
          <input
            type="text"
            placeholder="Image Src"
            value={img.src}
            onChange={e => handleImageChange(idx, 'src', e.target.value)}
            className="border rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Image Alt"
            value={img.alt}
            onChange={e => handleImageChange(idx, 'alt', e.target.value)}
            className="border rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => removeImage(idx)}
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

      {/* Custom Fields */}
<div className="border-t pt-4">
  <h3 className="text-xl font-bold mb-2">Custom Fields</h3>
  {customFields.map((cf, i) => (
    <div key={i} className="flex space-x-2 items-center mb-2">
      {/* Name & Value */}
      <input
        type="text"
        placeholder="Field name"
        value={cf.fieldName}
        onChange={e => handleCustomFieldChange(i, 'fieldName', e.target.value)}
        className="border rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Field value"
        value={cf.fieldValue}
        onChange={e => handleCustomFieldChange(i, 'fieldValue', e.target.value)}
        className="border rounded p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Header / Details toggles */}
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          checked={PropertyHeaders.includes(cf.fieldName)}
          onChange={e => handleHeaderCheckbox(cf.fieldName, e.target.checked)}
        />
        <span className="text-sm">Header</span>
      </label>
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          checked={propertyDetails.includes(cf.fieldName)}
          onChange={e => handleDetailsCheckbox(cf.fieldName, e.target.checked)}
        />
        <span className="text-sm">Details</span>
      </label>

      {/* Remove field */}
      <button
        type="button"
        onClick={() => removeCustomField(i)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Remove
      </button>
    </div>
  ))}

  {/* Add new custom field */}
  <button
    type="button"
    onClick={addCustomField}
    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
  >
    Add Custom Field
  </button>
</div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Preview
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save
          </button>
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </form>

       {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="bg-white m-auto w-full h-full md:w-3/4 md:h-5/6 overflow-auto rounded-lg shadow-lg">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕ Close
              </button>
            </div>
            {/* pass the top-level previewData */}
            <DetailsContent property={previewData} />
          </div>
          </div>
      )}
    </>                                
  );
}                           
 