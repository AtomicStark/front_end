import React, { useEffect, useState, useContext, useMemo } from 'react'
import './header.css'
// import '../../pages/tab/All.css'
import logo from '../../assets/logo.png'
import { Space } from 'antd'
import { AppstoreOutlined, DownOutlined, UnorderedListOutlined, UpOutlined } from '@ant-design/icons'
import { Button, Menu, Dropdown, Modal, Input, } from 'antd/es'
import strkimg from '../../assets/strk.png'
import btcimg from '../../assets/btc.png'
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { WalletContext } from '../../WalletContext';
import { value } from '../../bitcoinjs-lib'
import { message } from 'antd'


const getWidth = () => {
  return { width: window.innerWidth };
};



export default function Header() {
  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);
  const [list] = useState([
    { label: 'STRK Faucet', url: 'https://starknet-faucet.vercel.app/' },
    { label: 'BTC Faucet', url: 'https://coinfaucet.eu/en/btc-testnet/' },
    { label: 'Docs', url: 'https://atomicstark.gitbook.io/atomicstark-docs/' }
  ]);

  const {
    btcAddress,
    strkAddress,
    setStrkAddress,
    setBtcAddress,

    // address,
    setStrkAddressIsDropdownOpen,
    setBtcAddressIsDropdownOpen,

    isStrkAddressDropdownOpen,
    isBtcAddressDropdownOpen,


    CloseConnectStarknet,
    handleStarknetClick,
    handleBitcoinClick,
    setContextBtcPrivateKey,

  } = useContext(WalletContext);



  const handleMenuClick = (e) => {

    //关闭钱包
    if (e.key === '1') {
      if (strkAddress) {
        CloseConnectStarknet();
        setStrkAddress('');
      } else if (btcAddress) {
        setBtcAddress('');
        setBtcAddressIsDropdownOpen(false);
      }
    }

  };
  const handleMobileMenuClick = (e) => {
    message.info('please open on PC')
    return;
    const key = Number(e.key)
    switch (key) {
      case 1:
        //连接BTC
        handleBitcoinClick()
        break;
      case 2:
        //断开连接BTC
        setBtcAddress(''); // 重置 btcAddress 为空字符串
        break;
      case 3:
        //设置私钥
        setModalVisible(true)
        break;
      case 4:
        //连接stark
        handleStarknetClick()
        break;
      case 5:
        disconnect()
        // disconnectStarknetkit({ clearLastWallet: true });
        setStrkAddress('');
        break;
    }
    // console.log(e.key);
  }
  const [windowWidth, setWindowWidth] = useState(getWidth());
  const [flag, setFlag] = useState(false);
  const [modalVisible, setModalVisible] = useState(false)
  // 标记一下
  useEffect(() => {

    setStrkAddress(address);
    handleBitcoinClick()
    handleStarknetClick()
    const widthSize = () => {
      setWindowWidth(getWidth());
    };
    window.addEventListener("resize", widthSize);

    return () => {
      window.removeEventListener("resize", widthSize);
    };
  }, []);
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const strkDisconnectItems = {
    items: [{
      label: 'Disconnect',
      key: '1',
    }],
    onClick: () => {
      console.log('Disconnect starknet')
      disconnect()
      // disconnectStarknetkit({ clearLastWallet: true });
      setStrkAddress('');
      setStrkAddressIsDropdownOpen(false);
      // CloseConnectStarknet();

      setStrkAddress(''); // 重置 strkAddress 为空字符串
      setStrkAddressIsDropdownOpen(false);
    },
  };

  const btcDisconnectItems = {
    items: [
      {
        label: 'Disconnect',
        key: '1',
      },
      {
        label: 'Set Private Key(WIF)',
        key: '2'

      }

    ],
    onClick: (e) => {
      console.log('Disconnect bitcoin', e)
      if (e.key == '1') {
        //关闭钱包
        setBtcAddress(''); // 重置 btcAddress 为空字符串
        setBtcAddressIsDropdownOpen(false);
      } else if (e.key == '2') {
        //  "设置私钥"
        setModalVisible(true)
      }

    },
  }
  const btcConnectItem = {
    items: [{
      label: 'connect btc',
      key: '1',
    }],
  }

  const items = [
    {
      label: 'Disconnect',
      key: '1',
      // icon: <UserOutlined />,
    },
  ];
  const itemsa = [
    getItem('Connect Wallet', 'sub1', <img src={strkimg} alt="Description of the image" style={{ height: '20px' }} />, address ? [{ label: "Disconnect", key: 5 }] : [{ label: "Connect", key: 4 }]),
    getItem('Connect OKX', 'sub2', <img src={btcimg} alt="Description of the image" style={{ height: '20px' }} />, btcAddress ? [{ label: "Disconnect", key: 2 }, { label: "Set Private Key(WIF)", key: 3 }] : [{ label: "Connect", key: 1 }]),
  ];

  const menuProps = {
    items: items,
    onClick: handleMenuClick,
  };

  const handleStrkDropdownOpenChange = (open) => {
    if (!open) {
      // 如果下拉菜单关闭,不执行断开连接操作
      setStrkAddressIsDropdownOpen(open);
    }
  };

  const handleBtcDropdownOpenChange = (open) => {
    if (!open) {
      // 如果下拉菜单关闭,不执行断开连接操作
      setBtcAddressIsDropdownOpen(open);
    }
  };
  return (
    <div className='box'>
      {windowWidth.width < 670 ? <>
        <div className='left'>
          <img src={logo} alt="" />
        </div>
        <div className='right' >
          <UnorderedListOutlined onClick={() => setFlag(!flag)} style={{ width: "22px", zIndex: '1111', height: '22px', cursor: 'pointer' }} />
          <div className='flxed' style={{ right: flag ? '0px' : '-200px' }}> <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            onClick={handleMobileMenuClick}
            theme="dark"
            items={itemsa}
          /></div>
        </div>
      </> : <>
        <div className='left'>
          <img src={logo} alt="" />
          <ul>
            {/* {list.length > 0 && list.map((e, i) => {
              return (
                <a  key={i}>{e}</a>
              )
            })} */}
            {list.length > 0 && list.map((item, i) => (
              <li key={i}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              </li>
            ))}


          </ul>
        </div>
        <div className='right'>
          
            <Dropdown

              menu={strkDisconnectItems}
              trigger={['click']}
              open={isStrkAddressDropdownOpen}
              onOpenChange={handleStrkDropdownOpenChange}
            >
              <div className="text-xs bg-gray-700 px-2 py-1 rounded-full mx-1 flex items-center" style={{ position: 'relative' }}>
                <img src={strkimg} alt="Description of the image" style={{ height: '20px' }} />
                <div style={{ display: 'none' }} >
                  <span>Choose a wallet: </span>
                  {connectors.map((connector) => {
                    return (
                      <Button
                        key={connector.id}
                        onClick={() => connect({ connector })}
                        disabled
                        className="gap-x-2 mr-2"
                      >
                        {connector.id}
                      </Button>
                    );
                  })}
                </div>
                <button
                  className="text-xs bg-gray-700 px-2 py-1 rounded-full mx-1 flex items-center"
                  style={{ position: 'relative', overflow: 'hidden', boxShadow: '0 0 0 2px #38c89d', transition: 'box-shadow 0.3s', marginLeft: "10px", marginRight: "10px" }}
                  onClick={() => {
                    handleStarknetClick()
                  }}
                >
                  {address ? address.substring(0, 8) + '...' + address.substring(address.length - 8, address.length) : 'Connect Wallet'}
                  <span className="border-green-400 border-2 absolute inset-0 rounded-full hover:animate-spin-hover"></span>
                </button>{isStrkAddressDropdownOpen ? <DownOutlined /> : <UpOutlined />}
                {/* <span>{address}</span> */}
              </div>
            </Dropdown>
        
        </div>
      </>}
    </div>
  )
}
const PrivateKeyModal = (props) => {
  const [privateKey, setPrivateKey] = useState('');
  const handleOk = () => {
    // 在这里处理用户点击确认按钮后的逻辑
    console.log('Private Key:', privateKey);
    localStorage.setItem("btc_privatekey", privateKey)
  };
  const inputPrivateKeyModal = (
    <Modal
      className='custom-modal'
      title="Save private key"
      open={props.visible}
      onCancel={props.onCancel}
      footer={
        <Button ghost key="submit" className='bts' onClick={() => {
          localStorage.setItem("btc_privatekey", privateKey)
          props.setPrivateKey(privateKey)
          props.onCancel()
        }}>
          save key
        </Button>
      }
      onOk={() => {
        props.setPrivateKey(privateKey)
        props.onCancel()
      }}
      style={{ color: 'white' }} // 设置 Modal 的字体颜色为白色
    >
      <br />
      <Input
        type='password'
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        placeholder="private key"
        style={{ color: 'black' }} // 设置输入框的字体颜色为黑色，以确保可见
      />
      <p style={{ marginTop: '10px', fontSize: "15px", color: "red" }}>Note:this is testnet version of starknet, We won't get your privatekey. If you worry about losing money, please use your testnet wif.</p>
    </Modal>
  );

  return (
    <>
      {inputPrivateKeyModal}
    </>
  );
};
