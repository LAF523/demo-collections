import { useRef, useState } from 'react';
import styles from './index.module.less';
import { Button, Input } from 'antd';

const { TextArea } = Input;
const SQL = () => {
  const [src, serSrc] = useState('');
  const [oldsrc, serOldsrc] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    serSrc(e.target.value);
  };

  const onClick = () => {
    // console.log(src);
    const arr = src.split(';');
    arr.forEach(item => console.log(item));
  };
  return (
    <>
      <Button onClick={onClick}>点击</Button>
      <div className={styles.wrap}>
        <div className={styles.left}>
          <TextArea
            style={{ height: '100%', resize: 'none' }}
            onChange={val => onChange(val)}
          />
        </div>
        <div className={styles.right}>
          <TextArea style={{ height: '100%', resize: 'none' }} />
        </div>
      </div>
    </>
  );
};
export default SQL;
