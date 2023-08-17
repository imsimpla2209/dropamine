import React from 'react';
import { Alert, Typography, Button } from 'antd';
import './CustomBanner.css';

interface CustomBannerProps {
  finalClosedDate: Date;
}

const CustomBanner: React.FC<CustomBannerProps> = ({ finalClosedDate }) => {
  const now = new Date();

  if (now > finalClosedDate) {
    return (
      <div className="custom-banner">
        <Alert message="Warning" type="warning" className="custom-banner-alert" />
        <div className="custom-banner-content">
          <Typography.Text className="custom-banner-text">Currently, time has exceeded Finalclosededdate so you cannot comment for the Idea for this event</Typography.Text>
          <Button type="primary" className="custom-banner-button">Go back</Button>
        </div>
      </div>
    );
  }

  return null;
};

export default CustomBanner;
