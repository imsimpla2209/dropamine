import React from 'react';
import { Alert } from 'antd';

interface BannerProps {
    firstclosedeDat: Date;
}

const BannerFirstClosedDate: React.FC<BannerProps> = ({ firstclosedeDat }) => {
  const now = new Date();
  if (now > firstclosedeDat) {
    return (
      <>
        <style>
          {`
          .my-alert .ant-alert-message {
            font-size: 24px;
            font-weight: bold;
            color: #1890ff;
          }

          .my-alert .ant-alert-description {
            font-size: 18px;
            color: #e102d6;
            margin-top: 16px;
          }

          .my-alert {
            width: 100%;
          }

          .my-alert .ant-alert-icon {
            margin-top: 8px;
            
          }
        `}
        </style>
        <Alert 
          className="my-alert"
          message="Warning"
          description="Currently, time has exceeded FirstClosededdate so you cannot post IDEA for this event"
          type="warning"
          showIcon
        />
      </>
    );
  }
  return null;
};

export default BannerFirstClosedDate;
