"use client"
import { useState } from "react";
import { BulletConnector, ChogoryConnector, QS10, QS8, TycoConnectors } from "./ConnectorCom";

const connectors = [
  "QS 8",
  "QS 10",
  "Bullet Connectors",
  "Chogory Connectors",
  "Anderson Connectors",
  "Tyco Connectors",
  "Furukawa Connectors",
  "ZT2023-A",
  "XT90 Connectors",
  "26 Pin Supresal",
  "34 Pin Supresal",
];

export default function Connector() {
  const [selectedConnector, setSelectedConnector] = useState("Bullet Connectors");

  return (
    <div className="flex w-full p-4">
      {/* Left Sidebar */}
      <div className="w-full border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Connectors</h2>
        <ul>
          {connectors.map((connector) => (
            <li
              key={connector}
              className={`p-2 cursor-pointer rounded-md ${
                selectedConnector === connector ? "bg-orange-200" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedConnector(connector)}
            >
              {connector}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Form Section */}
      <div className="w-full p-6">
        <h2 className="text-xl font-bold mb-4">{selectedConnector}</h2>
          {selectedConnector === "Chogory Connectors" && <ChogoryConnector/>}
          {selectedConnector === "Tyco Connectors" && <TycoConnectors/>}
          {selectedConnector === "QS 8" && <QS8/>}
          {selectedConnector === "QS 10" && <QS10/>}
          {selectedConnector === "Bullet Connectors" && <BulletConnector/>}
          {selectedConnector === "Anderson Connectors" && <ChogoryConnector/>}
          {selectedConnector === "Furukawa Connectors" && <TycoConnectors/>}
          {selectedConnector === "ZT2023-A" && <QS8/>}
          {selectedConnector === "XT90 Connectors" && <QS8/>}
          {selectedConnector === "26 Pin Supresal" && <QS8/>}
          {selectedConnector === "34 Pin Supresal" && <QS8/>}

      </div>
    </div>
  );
}
