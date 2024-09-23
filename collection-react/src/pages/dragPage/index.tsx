import DragBox from '@/components/dragBox';

interface dataType {
  name: string;
  index: number;
}
const DragPage: React.FC = () => {
  const data: dataType[] = [
    { name: '第一个元素', index: 1 },
    { name: '第二个元素', index: 2 },
    { name: '第三个元素', index: 3 },
    { name: '第四个元素', index: 4 },
    { name: '第五个元素', index: 5 },
    { name: '第六个元素', index: 6 },
    { name: '第七个元素', index: 7 },
    { name: '第八个元素', index: 8 },
    { name: '第九个元素', index: 9 },
    { name: '第十个元素', index: 10 }
  ];

  const onDragEnd = (v: dataType[]) => {
    console.log(v);
  };
  return (
    <>
      <DragBox<dataType>
        data={data}
        onDragEnd={onDragEnd}
        itemKey="index"
      >
        {item => <div style={{ height: '50px', lineHeight: '50px', textAlign: 'center' }}>{item.name}</div>}
      </DragBox>
    </>
  );
};

export default DragPage;
