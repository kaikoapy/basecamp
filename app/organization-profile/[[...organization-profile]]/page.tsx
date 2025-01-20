// "use client";

// import {
//   OrganizationProfile,
//   useOrganization,
//   OrganizationList,
// } from "@clerk/nextjs";
// import React from "react";

// export default function OrganizationProfilePage() {
//   const { organization, isLoaded } = useOrganization();

//   if (!isLoaded) {
//     return null;
//   }

//   if (!organization) {
//     return (
//       <div className="container mx-auto py-8">
//         <div className="max-w-3xl mx-auto">
//           <h1 className="text-2xl font-bold mb-6">Organization Management</h1>
//           <p className="text-gray-600 mb-8">
//             Create or select an organization to continue.
//           </p>
//           <OrganizationList
//             hidePersonal
//             afterSelectOrganizationUrl="/organization-profile"
//             afterCreateOrganizationUrl="/organization-profile"
//           />
//         </div>
//       </div>
//     );
//   }

//   return <OrganizationProfile />;
// }
