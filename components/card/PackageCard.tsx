'use client'
import { Id } from "../../convex/_generated/dataModel";
import { FaUserFriends, FaClock, FaPaperPlane } from 'react-icons/fa';

export interface Package {
  _id: Id<"packages">;
  capacity: number;
  price: number;
  hours: number;
}

interface PackageCardProps {
  pkg: Package;
}

export function PackageCard({ pkg }: PackageCardProps) {
  const handlePackageClick = () => {
    console.log("Package selected:", pkg);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 transition-transform hover:scale-105 hover:shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-600">${pkg.price}</h3>
        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
          {pkg.hours} {pkg.hours === 1 ? 'Hour' : 'Hours'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <FaUserFriends className="mr-2 text-gray-500" />
          <span>
            {pkg.capacity} {pkg.capacity === 1 ? 'Student' : 'Students'}
          </span>
        </div>
        <div className="flex items-center">
          <FaClock className="mr-2 text-gray-500" />
          <span>${(pkg.price / pkg.hours).toFixed(2)} per hour</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button 
          onClick={handlePackageClick}
          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition-colors"
          aria-label="Select package"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}