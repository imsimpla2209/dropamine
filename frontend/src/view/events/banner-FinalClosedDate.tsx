import React from 'react';
import { Result, Button } from 'antd';

interface BannerProps {
  finalClosedDate: Date;
}

const BannerFinalClosedDate: React.FC<BannerProps> = ({ finalClosedDate }) => {
  const now = new Date();

  if (now > finalClosedDate) {
    return (
      <Result style={{ width:"100%", backgroundColor:"rgb(186, 217, 228)" }}
    status="error"
    title="Cannot comment for ideas"
    subTitle={<span style={{ fontSize: '1.2rem', fontWeight: 500, color:'red'}}>Currently, time has exceeded Finalclosededdate so you cannot comment for the Idea for this event</span>}
    extra={[
      <Button type="primary" key="">
        Back To Home
      </Button>,
    ]}
  />
    );
  }

  return null;
};

export default BannerFinalClosedDate;
