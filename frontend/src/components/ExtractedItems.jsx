import { FiImage, FiPlay, FiUpload } from 'react-icons/fi';

const ExtractedItems = () => {
  // Sample data structure
  const extractedData = {
    imageName: "flower-structure1.jpg",
    items: [
      {
        name: "Stamen",
        parts: ["Anther", "Filament", "Petal", "Sepal", "Pedicel"]
      },
      {
        name: "Style",
        parts: ["Stigma", "Ovary", "Ovule", "Receptacle"]
      },
      {
        name: "Carpel",
        parts: ["Anther", "Filament", "Stamen", "Stigma"]
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Extracted Items from {extractedData.imageName}
        </h1>
        <p className="text-lg text-gray-600">
          Found {extractedData.items.length} item(s). Choose one to start learning!
        </p>
      </div>

      <div className="mb-8 bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center mb-4">
          <FiImage className="text-indigo-600 mr-2 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800">Uploaded Image</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {extractedData.items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <h3 className="font-medium text-lg text-gray-800 mb-2">{item.name}</h3>
              <ul className="space-y-1">
                {item.parts.map((part, partIndex) => (
                  <li key={partIndex} className="text-gray-600">• {part}</li>
                ))}
              </ul>
              <button className="mt-3 w-full py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition flex items-center justify-center">
                <FiPlay className="mr-2" /> Learn
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-8">
        <p className="text-gray-600">
          <span className="font-medium">Context:</span> Uploaded image; {extractedData.imageName}
        </p>
      </div>

      <div className="text-center">
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center mx-auto">
          <FiPlay className="mr-2" /> View & Play Games
        </button>
      </div>
    </div>
  );
};

export default ExtractedItems;