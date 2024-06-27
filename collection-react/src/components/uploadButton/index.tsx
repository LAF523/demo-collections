import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import { getUploadDetial, upload, merge } from '@/service/upload.ts';
import SparkMD5 from 'spark-md5';
import { paralleTask, CallBackprops } from '@/common/index.ts';

const errTasks: (() => Promise<any>)[] | [] = [];
const UploadButton: React.FC = () => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const props: UploadProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      setFileList([file]);
      return false;
    },
    fileList
  };

  const handleUpload = async () => {
    setUploading(true);
    const file = fileList[0];

    const { md5, suffix } = await getIdentityAndName(file);

    const [data, err] = await getUploadDetial({ md5, suffix });
    if (err) message.error('上传失败!');
    const { isUploaded, list: fileHistoryList } = data;
    if (isUploaded) return message.success('上传成功!');

    await beginUpload(file, md5, suffix, fileHistoryList);
    const [a, s, success] = await merge({ md5, suffix });

    if (success) return message.success('上传成功');
    message.error('上传失败!');
    setUploading(false);
  };

  async function beginUpload(file: File, md5: string, suffix: string, fileHistoryList: string[]) {
    const size = getChunkSize(file.size as number);
    const chunks = getChunks(file, size, md5, suffix, fileHistoryList);
    const tasks = packageTasks(chunks);
    await paralleTask(tasks, 4, callBack);
    await retry(2);
  }

  function callBack({ res, task }: CallBackprops) {
    const err = res[1];
    if (err) {
      errTasks.push(task);
    }
  }
  async function retry(maxRetry: number) {
    let currRetry = 1;
    while (errTasks.length > 0 && currRetry < maxRetry) {
      const len = errTasks.length;
      await paralleTask(errTasks.splice(0, len), 4, callBack);
      currRetry++;
    }
  }

  function getIdentityAndName(file: any): Promise<{ md5: string; suffix: string }> {
    return new Promise((resolve, reject) => {
      const suffix = file.name.split('.')[1];

      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = e => {
        const buffer = e.target?.result;
        const spark = new SparkMD5.ArrayBuffer();
        spark.append(buffer as ArrayBuffer);
        const md5 = spark.end();
        resolve({ md5, suffix });
      };
      fileReader.onerror = error => {
        reject(error);
      };
    });
  }

  function getChunkSize(fileSize: number) {
    const defaultSize = 1 * 1024 * 1024; // 每片1M
    const defaultCount = 100;
    const maxCount = Math.ceil(fileSize / defaultSize);
    const maxSize = Math.ceil(fileSize / defaultCount);
    return maxCount > defaultCount ? maxSize : defaultSize;
  }

  function getChunks(file, size: number, md5: string, suffix: string, list: string[]) {
    let index = 0;
    const end = Math.ceil(file.size / size);
    const result = [];
    while (index < end) {
      const chunk = file.slice(index * size, (index + 1) * size);
      const chunkName = `${index}-${md5}.${suffix}`;
      if (!isUploadedFile(list, chunkName)) {
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('md5', md5);
        formData.append('chunkName', chunkName);
        result.push(formData);
      }

      index++;
    }
    return result;
  }
  function packageTasks(chunks: FormData[]) {
    return chunks.map(item => {
      return upload.bind(null, item);
    });
  }

  function isUploadedFile(list: string[], name: string) {
    return list.includes(name);
  }

  return (
    <>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
    </>
  );
};

export default UploadButton;
