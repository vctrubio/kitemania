'use client'
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PackageCard, Package } from "../card/PackageCard";
import { FaPlus, FaChevronDown } from "react-icons/fa";

export function PackagesList() {
    const packages = useQuery(api.packages.listPackages) ?? [];
    const createPackage = useMutation(api.packages.createPackage);

    // State for dropdown to add new package
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [newPackage, setNewPackage] = useState({
        capacity: 1,
        price: '',
        hours: 1
    });

    // Group packages by capacity
    const groupedPackages = packages.reduce((acc, pkg) => {
        const capacity = pkg.capacity;
        if (!acc[capacity]) {
            acc[capacity] = [];
        }
        acc[capacity].push(pkg);
        return acc;
    }, {} as Record<number, Package[]>);

    // Sort capacities for consistent display order
    const capacities = Object.keys(groupedPackages)
        .map(Number)
        .sort((a, b) => a - b);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPackage({
                capacity: newPackage.capacity,
                price: parseInt(newPackage.price) || 0,
                hours: newPackage.hours
            });
            setIsDropdownOpen(false);
            setNewPackage({
                capacity: 1,
                price: '',
                hours: 1
            });
        } catch (error) {
            console.error("Error creating package:", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Lesson Packages</h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <FaPlus className="mr-2" /> Add Package {isDropdownOpen ? <FaChevronDown className="ml-2 transform rotate-180" /> : <FaChevronDown className="ml-2" />}
                </button>
            </div>

            {/* New Package Dropdown Form */}
            {isDropdownOpen && (
                <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-gray-700 mb-2">Students</label>
                            <div className="relative">
                                <select
                                    className="w-full border rounded-lg p-2 appearance-none pr-8"
                                    value={newPackage.capacity}
                                    onChange={(e) => setNewPackage({ ...newPackage, capacity: parseInt(e.target.value) })}
                                    required
                                >
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Student' : 'Students'}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <FaChevronDown className="text-xs" />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-gray-700 mb-2">Price ($)</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-2"
                                value={newPackage.price}
                                onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value.replace(/[^0-9]/g, '') })}
                                placeholder="Enter price"
                                required
                            />
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="block text-gray-700 mb-2">Hours</label>
                            <div className="relative">
                                <select
                                    className="w-full border rounded-lg p-2 appearance-none pr-8"
                                    value={newPackage.hours}
                                    onChange={(e) => setNewPackage({ ...newPackage, hours: parseInt(e.target.value) })}
                                    required
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Hour' : 'Hours'}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <FaChevronDown className="text-xs" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Add Package
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {capacities.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No packages available. Add your first package!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {capacities.map((capacity) => (
                        <div key={capacity} className="border-b pb-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-700">
                                {capacity} {Number(capacity) === 1 ? 'Student' : 'Students'} Packages
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {groupedPackages[capacity].map((pkg) => (
                                    <PackageCard key={pkg._id} pkg={pkg} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Removing the modal since we're now using the dropdown */}
        </div>
    );
}