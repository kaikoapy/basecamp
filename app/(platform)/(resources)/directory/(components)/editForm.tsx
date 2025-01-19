// "use client";
// import { useState } from "react";
// import { Doc } from "../../../../../convex/_generated/dataModel";

// interface EditFormProps {
//   contact: Doc<"directory">;
//   onCancel: () => void;
//   onSave: (contact: Partial<Doc<"directory">>) => void;
//   onDelete?: () => void;
// }

// export const EditForm: React.FC<EditFormProps> = ({
//   contact,
//   onCancel,
//   onSave,
//   onDelete,
// }) => {
//   const [formData, setFormData] = useState({
//     name: contact.name,
//     position: contact.position,
//     department: contact.department,
//     extension: contact.extension,
//     number: contact.number,
//     email: contact.email,
//   });

//   const departments = [
//     "Management",
//     "Sales",
//     "Service",
//     "Parts",
//     "Finance",
//     "Accounting",
//     "Logistics",
//     "Other",
//   ];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4">
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name
//           </label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, name: e.target.value }))
//             }
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Department
//           </label>
//           <select
//             value={formData.department}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, department: e.target.value }))
//             }
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//           >
//             {departments.map((dept) => (
//               <option key={dept} value={dept}>
//                 {dept}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Position
//           </label>
//           <input
//             type="text"
//             value={formData.position}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, position: e.target.value }))
//             }
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Extension
//           </label>
//           <input
//             type="text"
//             value={formData.extension}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, extension: e.target.value }))
//             }
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Phone
//           </label>
//           <input
//             type="text"
//             value={formData.number}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, number: e.target.value }))
//             }
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             value={formData.email}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, email: e.target.value }))
//             }
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="flex justify-end space-x-2 pt-4">
//           {onDelete && (
//             <button
//               type="button"
//               onClick={onDelete}
//               className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
//             >
//               Delete
//             </button>
//           )}
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };
