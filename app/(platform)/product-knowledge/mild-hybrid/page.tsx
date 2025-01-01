import React from "react";
import {
  Battery,
  Zap,
  Gauge,
  CarFront,
  RefreshCw,
  Leaf,
  AlertCircle,
  CircleDot,
} from "lucide-react";

const MildHybridGuide = () => {
  const keyComponents = [
    {
      title: "Integrated Starter Generator (ISG)",
      description:
        "Electric motor/generator mounted between the engine and transmission",
      icon: Zap,
    },
    {
      title: "48-Volt Battery",
      description: "Stores recovered energy for use when needed",
      icon: Battery,
    },
    {
      title: "Brake-by-Wire System",
      description: "Enables energy recovery during braking and coasting",
      icon: RefreshCw,
    },
  ];

  const keyFeatures = [
    {
      title: "Energy Recovery",
      description: "Recovers energy during braking and coasting",
      icon: RefreshCw,
    },
    {
      title: "Smooth Start/Stop",
      description:
        "Provides smoother and faster engine start/stop functionality",
      icon: CircleDot,
    },
    {
      title: "Power Boost",
      description: "Adds approximately 14 horsepower during acceleration",
      icon: Gauge,
    },
    {
      title: "Engine-Off Coasting",
      description: "Enables engine-off coasting in certain conditions",
      icon: CarFront,
    },
    {
      title: "Improved Efficiency",
      description: "10-15% better fuel efficiency vs non-hybrid versions",
      icon: Leaf,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Volvo Mild Hybrid System</h1>
          <p className="text-xl">Understanding the &quot;B&quot; Models</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Quick Overview */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Overview</h2>
            <p className="text-gray-700">
              Volvo&apos;s mild hybrid system is a 48-volt setup that assists
              the main engine to improve efficiency and smoothness. These
              vehicles are marked with a &quot;B&quot; designation (like B5,
              B6), replacing the &quot;T&quot; designation used for pure
              combustion engines.
            </p>
          </section>

          {/* Key Components */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Key Components</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {keyComponents.map((component, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg"
                >
                  <component.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="font-bold mb-2">{component.title}</h3>
                  <p className="text-gray-600">{component.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Key Features */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {keyFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <feature.icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="space-y-6">
              <p className="text-gray-700">During normal driving:</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <p>
                    The gas engine does the primary work of moving the vehicle
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <p>
                    The electric system provides assistance during specific
                    scenarios:
                    <ul className="mt-2 ml-6 space-y-2">
                      <li>• Smoother start/stop operation at traffic lights</li>
                      <li>• Small power boost during acceleration</li>
                      <li>
                        • Energy recovery when braking or coasting downhill
                      </li>
                    </ul>
                  </p>
                </li>
              </ul>
            </div>
          </section>

          {/* Important Notes */}
          <section className="bg-yellow-50 rounded-lg shadow-lg p-6">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <h2 className="font-bold mb-4">Important Points to Remember</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    • This is NOT a regular hybrid - it cannot drive on
                    electricity alone
                  </li>
                  <li>
                    • The system&apos;s main purpose is to improve efficiency
                    and smoothness
                  </li>
                  <li>
                    • Look for the &quot;B&quot; designation to identify mild
                    hybrid models
                  </li>
                  <li>
                    • The technology is designed to be seamless and may not be
                    noticeable to drivers
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MildHybridGuide;
