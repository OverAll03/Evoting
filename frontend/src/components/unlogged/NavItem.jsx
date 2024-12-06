import React from "react";

function NavItem({ label, href, hasDropdown }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-lg font-medium text-white hover:bg-blue-700 rounded-md transition-colors duration-300 ease-in-out whitespace-nowrap"
    >
      {label}
      {hasDropdown && (
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/45625405a492068c11ab77328555a396e11c45f4d18218c55af2244bc340f8f8?placeholderIfAbsent=true&apiKey=549c322b647e496e99a9065b5f46d9e4"
          alt=""
          className="w-4 h-4 object-contain"
        />
      )}
    </a>
  );
}

export default NavItem;

