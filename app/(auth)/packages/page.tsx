import { PackagesList } from "../../../components/shows/PackagesList";

export default function PackagesPage() {
  return (
    <main className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Packages</h1>
      <PackagesList />
    </main>
  );
}
