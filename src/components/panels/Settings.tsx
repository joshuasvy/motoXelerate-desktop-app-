import PanelHeader from "../PanelHeader";

function Settings() {
  return (
    <div>
      <div className="mb-6 border-b border-gray-200">
        <PanelHeader name="Settings" />
      </div>
      <div className="space-y-5">
        <p className="text-2xl font-semibold pb-5 border-b border-gray-400">
          Personal Information
        </p>
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="text-md border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold mb-2">Email Address</label>
          <input
            type="email"
            placeholder="Enter your admin email"
            className="text-md border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Change Password */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold mb-2">Change Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            className="text-md border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black mb-3"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="text-md border border-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Save Changes
        </button>
      </div>
      <div className="mt-8">
        <p className="text-2xl font-semibold pb-5 border-b border-gray-400">
          Appearance
        </p>

        <div className="space-y-6 mt-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium">Theme</label>
            <select
              className="border border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              defaultValue="light"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          {/* Accent Color Picker */}
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium">Accent Color</label>
            <input
              type="color"
              className="w-12 h-8 border border-black rounded-md cursor-pointer"
              defaultValue="#000000"
            />
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center justify-between">
            <label className="text-lg font-medium">Font Size</label>
            <select
              className="border border-black rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              defaultValue="medium"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            type="button"
            className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            Save Appearance
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
