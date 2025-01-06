import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';

const Overlay: React.FC = () => {
  return (
    // <div className="w-full h-screen flex flex-col justify-center items-center bg-white">
    //   <ExclamationCircleOutlined
    //     className="text-[64px] text-[#faad14] mb-8"
    //   />
    //   <h2 className="text-2xl mb-5">
    //     <FormattedMessage
    //       id="pages.examination.notPassed"
    //       defaultMessage="你没有通过测试，不可接单"
    //     />
    //   </h2>
    //   <p className="text-lg mb-5">
    //     <FormattedMessage
    //       id="pages.examination.pleaseComplete"
    //       defaultMessage="请完成测试后再尝试接单。"
    //     />
    //   </p>
    // </div>
    <>
      <div className="mb-4 text-xl font-medium pl-4 pr-8 py-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium font-bold">新手训练</div>
          <div className="flex items-center gap-2">
            {/* <Button
              className="text-sm rounded-md px-2 py-1"
              onClick={() => setIsModalVisible(true)}
            >
              答题概况
            </Button> */}
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-20 rounded-lg shadow-sm flex flex-col items-center">
            <ExclamationCircleOutlined
              style={{ fontSize: '96px', color: 'red', marginBottom: '20px' }}
            />
            <h1>你没有通过测试，不可接单</h1>
            <h2 className="mt-8 text-2xl font-medium">请完成测试后再尝试接单</h2>
            <div className="mt-10 space-x-20">
              {/* <Button
                type="primary"
                size="large"
                onClick={() => history.push('/examination-rooms')}
              >
                前往接单
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overlay;
