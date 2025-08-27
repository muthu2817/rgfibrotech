import React from 'react';

const PageHeader = ({ title, leftContent, rightContent }) => (
  <div className="flex items-center justify-between w-full relative py-4 px-6">
    <div className="flex items-center justify-between w-full">
      {leftContent}
      {rightContent}
    </div>
  </div>
);

export default PageHeader;
